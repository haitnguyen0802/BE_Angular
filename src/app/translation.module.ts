import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslationService } from './services/translation.service';

@NgModule({
  imports: [
    CommonModule,
    TranslatePipe
  ],
  providers: [
    TranslationService
  ],
  exports: [
    TranslatePipe
  ]
})
export class TranslationModule { } 