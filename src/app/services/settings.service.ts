import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Các loại theme
export type ThemeMode = 'light' | 'dark' | 'auto';
// Các loại ngôn ngữ
export type Language = 'vi' | 'en';
// Các loại màu sắc theme
export type ThemeColor = 'blue' | 'black' | 'white';

export interface AppSettings {
  language: Language;
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  adminEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'app_settings';
  
  // Cài đặt mặc định
  private defaultSettings: AppSettings = {
    language: 'vi',
    themeMode: 'auto',
    themeColor: 'blue',
    adminEmail: ''
  };
  
  // BehaviorSubject để theo dõi thay đổi cài đặt
  private settingsSubject = new BehaviorSubject<AppSettings>(this.defaultSettings);
  
  // Observable để component có thể đăng ký nhận thay đổi
  public settings$: Observable<AppSettings> = this.settingsSubject.asObservable();
  
  constructor() {
    this.loadSettings();
    this.applySettings(this.settingsSubject.value);
    
    // Kiểm tra thời gian để áp dụng dark mode nếu đang ở chế độ auto
    if (this.settingsSubject.value.themeMode === 'auto') {
      this.checkTimeForDarkMode();
      
      // Kiểm tra mỗi phút để cập nhật dark mode nếu cần
      setInterval(() => this.checkTimeForDarkMode(), 60000);
    }
  }
  
  /**
   * Tải cài đặt từ localStorage
   */
  private loadSettings(): void {
    const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        this.settingsSubject.next({
          ...this.defaultSettings,
          ...parsedSettings
        });
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }
  
  /**
   * Cập nhật cài đặt
   */
  updateSettings(settings: Partial<AppSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, ...settings };
    
    // Lưu cài đặt mới vào localStorage
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
    
    // Cập nhật subject
    this.settingsSubject.next(newSettings);
    
    // Áp dụng cài đặt mới
    this.applySettings(newSettings);
  }
  
  /**
   * Áp dụng cài đặt vào ứng dụng
   */
  private applySettings(settings: AppSettings): void {
    // Áp dụng theme
    this.applyTheme(settings.themeMode, settings.themeColor);
    
    // Áp dụng ngôn ngữ
    document.documentElement.setAttribute('lang', settings.language);
  }
  
  /**
   * Áp dụng theme dựa vào cài đặt
   */
  private applyTheme(themeMode: ThemeMode, themeColor: ThemeColor): void {
    const isDark = themeMode === 'dark' || 
      (themeMode === 'auto' && this.shouldUseDarkMode());
    
    // Đặt class cho body để CSS có thể áp dụng
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
    
    // Đặt màu sắc cho theme
    document.body.classList.remove('color-blue', 'color-black', 'color-white');
    document.body.classList.add(`color-${themeColor}`);
  }
  
  /**
   * Kiểm tra thời gian để quyết định có nên dùng dark mode hay không
   */
  private checkTimeForDarkMode(): void {
    if (this.settingsSubject.value.themeMode === 'auto') {
      const isDark = this.shouldUseDarkMode();
      const currentThemeIsDark = document.body.classList.contains('theme-dark');
      
      if (isDark !== currentThemeIsDark) {
        this.applyTheme('auto', this.settingsSubject.value.themeColor);
      }
    }
  }
  
  /**
   * Kiểm tra có nên dùng dark mode dựa vào thời gian
   */
  private shouldUseDarkMode(): boolean {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
  }
  
  /**
   * Lấy cài đặt hiện tại
   */
  getCurrentSettings(): AppSettings {
    return this.settingsSubject.value;
  }
  
  /**
   * Reset về cài đặt mặc định
   */
  resetToDefaults(): void {
    this.updateSettings(this.defaultSettings);
  }
} 