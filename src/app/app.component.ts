import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TranslationService } from './services/translation.service';
import { SettingsService } from './services/settings.service';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular_BE';

  constructor(
    private translationService: TranslationService,
    private settingsService: SettingsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize translation service with current language from settings
    const currentSettings = this.settingsService.getCurrentSettings();
    this.translationService.setLanguage(currentSettings.language);
    
    // Subscribe to language changes from settings service
    this.settingsService.settings$.subscribe(settings => {
      this.translationService.setLanguage(settings.language);
    });
    
    // Kiểm tra trạng thái đăng nhập
    this.authService.currentUser$.pipe(
      map(user => !!user) // Chuyển đổi user thành boolean
    ).subscribe(isLoggedIn => {
      if (!isLoggedIn && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      } else if (isLoggedIn && this.router.url === '/login') {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
