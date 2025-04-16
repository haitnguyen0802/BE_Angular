import { Component, OnInit, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService, ThemeMode, ThemeColor, Language, AppSettings } from '../../services/settings.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe]
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
    { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { value: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' }
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

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private translationService: TranslationService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string
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
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup form value change listeners
   */
  private setupFormListeners(): void {
    // Update preview when form values change
    this.settingsForm.get('themeMode')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.previewMode = value as ThemeMode;
      });
    
    this.settingsForm.get('themeColor')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.previewColor = value as ThemeColor;
      });

    // Apply language changes immediately when selection changes
    this.settingsForm.get('language')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.applyLanguage(value as Language);
      });
  }

  /**
   * Apply selected language to the application
   */
  private applyLanguage(language: Language): void {
    // Set the HTML lang attribute
    this.document.documentElement.setAttribute('lang', language);

    // Add language class to body for CSS selectors
    this.document.body.classList.remove('lang-vi', 'lang-en', 'lang-zh', 'lang-ja');
    this.document.body.classList.add(`lang-${language}`);

    // Update TranslationService with the new language
    this.translationService.setLanguage(language);

    // For demonstration, we'll just update the page title based on language
    switch(language) {
      case 'vi':
        this.document.title = 'Hệ thống quản lý';
        break;
      case 'en':
        this.document.title = 'Management System';
        break;
      case 'zh':
        this.document.title = '管理系统';
        break;
      case 'ja':
        this.document.title = '管理システム';
        break;
      default:
        this.document.title = 'Management System';
    }

    // Show a notification about the language change
    const langName = this.languages.find(l => l.value === language)?.label || language;
    this.showNotificationMessage(`Đã chuyển ngôn ngữ sang: ${langName}`, 'success');
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
      
      // Apply the current language
      this.applyLanguage(currentSettings.language || 'vi');
      
      // Also subscribe to future changes
      this.settingsSubscription = this.settingsService.settings$
        .pipe(takeUntil(this.destroy$))
        .subscribe(
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
      
      // Apply any settings that need immediate effect
      this.applyLanguage(settings.language || 'vi');
      
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

  // Get current language flag for display
  getCurrentLanguageFlag(): string {
    const currentLang = this.settingsForm.get('language')?.value;
    const language = this.languages.find(lang => lang.value === currentLang);
    return language ? language.flag : '';
  }
  
  // Get current language name for display
  getCurrentLanguageName(): string {
    const currentLang = this.settingsForm.get('language')?.value;
    const language = this.languages.find(lang => lang.value === currentLang);
    return language ? language.label : '';
  }
} 