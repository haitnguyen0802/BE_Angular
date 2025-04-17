import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layout components
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { FooterComponent } from './components/layout/footer/footer.component';

// Feature components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CustomersComponent } from './components/customers/customers.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ChartComponent } from './components/chart/chart.component';
import { LoginComponent } from './components/login/login.component';

// Services
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { CustomerService } from './services/customer.service';
import { OrderService } from './services/order.service';
import { DashboardService } from './services/dashboard.service';
import { SettingsService } from './services/settings.service';
import { TranslationService } from './services/translation.service';
import { AuthService } from './services/auth.service';
import { addExtraTranslations } from './services/translation-extras';

// Pipes
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    CategoriesComponent,
    ProductsComponent,
    OrdersComponent,
    CustomersComponent,
    SettingsComponent,
    ChartComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    LoginComponent
  ],
  providers: [
    CategoryService,
    ProductService,
    CustomerService,
    OrderService,
    DashboardService,
    SettingsService,
    TranslationService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translationService: TranslationService) {
    // Add extra translations at application startup
    addExtraTranslations(translationService);
  }
} 