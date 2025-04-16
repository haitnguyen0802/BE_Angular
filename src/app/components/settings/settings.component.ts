import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService, ThemeMode, ThemeColor, Language, AppSettings } from '../../services/settings.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup = this.createForm();
  isLoading = true;
  isSaving = false;
  activeTab = 'general';
  private settingsSubscription: Subscription | null = null;

  // Notification
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  // Language options
  languages = [
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' }
  ];

  // Theme color options
  themeColors = [
    { value: 'blue', label: 'Xanh dương' },
    { value: 'black', label: 'Đen' },
    { value: 'white', label: 'Trắng' }
  ];

  // Preview settings
  previewMode: ThemeMode = 'light';
  previewColor: ThemeColor = 'blue';

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {}

  /**
   * Create form with default values
   */
  private createForm(): FormGroup {
    return this.fb.group({
      language: ['vi', Validators.required],
      themeMode: ['light', Validators.required],
      themeColor: ['blue', Validators.required],
      adminEmail: ['', [Validators.email]] // Optional field
    });
  }

  ngOnInit(): void {
    this.loadSettings();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  /**
   * Setup form value change listeners
   */
  private setupFormListeners(): void {
    // Update preview when form values change
    this.settingsForm.get('themeMode')?.valueChanges.subscribe(value => {
      this.previewMode = value as ThemeMode;
    });
    
    this.settingsForm.get('themeColor')?.valueChanges.subscribe(value => {
      this.previewColor = value as ThemeColor;
    });
  }

  /**
   * Load settings from service
   */
  loadSettings(): void {
    this.isLoading = true;
    
    // Get current settings directly
    try {
      const currentSettings = this.settingsService.getCurrentSettings();
      
      // Apply the settings to the form
      this.settingsForm.patchValue({
        language: currentSettings.language || 'vi',
        themeMode: currentSettings.themeMode || 'light',
        themeColor: currentSettings.themeColor || 'blue',
        adminEmail: currentSettings.adminEmail || ''
      });
      
      this.previewMode = currentSettings.themeMode || 'light';
      this.previewColor = currentSettings.themeColor || 'blue';
      
      // Also subscribe to future changes
      this.settingsSubscription = this.settingsService.settings$.subscribe(
        (settings: AppSettings) => {
          // Update form if settings change externally
          this.settingsForm.patchValue({
            language: settings.language || 'vi',
            themeMode: settings.themeMode || 'light',
            themeColor: settings.themeColor || 'blue',
            adminEmail: settings.adminEmail || ''
          });
          
          this.previewMode = settings.themeMode || 'light';
          this.previewColor = settings.themeColor || 'blue';
        }
      );
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showNotificationMessage('Không thể tải cài đặt. Đã sử dụng cài đặt mặc định.', 'error');
    } finally {
      // End loading state
      this.isLoading = false;
    }
  }

  /**
   * Save settings
   */
  saveSettings(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.showNotificationMessage('Vui lòng kiểm tra lại các trường dữ liệu chưa hợp lệ.', 'error');
      return;
    }

    const formValues = this.settingsForm.value;
    this.isSaving = true;

    try {
      // Convert form values to correct types
      const settings: Partial<AppSettings> = {
        language: formValues.language as Language,
        themeMode: formValues.themeMode as ThemeMode,
        themeColor: formValues.themeColor as ThemeColor,
        adminEmail: formValues.adminEmail
      };

      // Update settings in service
      this.settingsService.updateSettings(settings);
      this.showNotificationMessage('Cài đặt đã được lưu thành công!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showNotificationMessage('Không thể lưu cài đặt. Vui lòng thử lại sau.', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Reset settings to defaults
   */
  resetToDefaults(): void {
    this.isSaving = true;
    
    try {
      this.settingsService.resetToDefaults();
      this.showNotificationMessage('Đã khôi phục cài đặt mặc định.', 'success');
      
      // Load the default settings
      this.loadSettings();
    } catch (error) {
      console.error('Error resetting settings:', error);
      this.showNotificationMessage('Không thể khôi phục cài đặt mặc định.', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Set active tab
   */
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  /**
   * Show notification message
   */
  showNotificationMessage(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  /**
   * Check if form field is invalid
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.settingsForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
} 