import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from './services/translation.service';
import { SettingsService } from './services/settings.service';

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
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    // Initialize translation service with current language from settings
    const currentSettings = this.settingsService.getCurrentSettings();
    this.translationService.setLanguage(currentSettings.language);
    
    // Subscribe to language changes from settings service
    this.settingsService.settings$.subscribe(settings => {
      this.translationService.setLanguage(settings.language);
    });
  }
}
