import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, CardData, Order, ChartData } from '../../services/dashboard.service';
import { ChartComponent } from '../chart/chart.component';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';
import { CategoriesComponent } from '../categories/categories.component';
import { CustomersComponent } from '../customers/customers.component';
import { OrdersComponent } from '../orders/orders.component';
import { SettingsComponent } from '../settings/settings.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ChartComponent, 
    FormsModule, 
    ProductsComponent, 
    CategoriesComponent,
    CustomersComponent,
    OrdersComponent,
    SettingsComponent,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Dashboard data
  cardData: CardData[] = [];
  recentOrders: Order[] = [];
  chartData: ChartData | null = null;
  selectedPeriod: 'week' | 'month' | 'year' = 'week';
  // Expose Math to the template
  Math = Math;
  
  // Tab control
  activeTab: string = 'dashboard';
  
  constructor(
    private dashboardService: DashboardService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    // Restore the active tab from localStorage if available
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      this.activeTab = savedTab;
    }
    
    this.loadCardData();
    this.loadChartData();
    this.loadRecentOrders();
  }
  
  /**
   * Get currency symbol based on the current language
   */
  get currencySymbol(): string {
    const lang = this.getCurrentLanguage();
    switch (lang) {
      case 'vi': return '₫';
      case 'zh': 
      case 'ja': return '¥';
      case 'en':
      default: return '$';
    }
  }
  
  /**
   * Get current language code
   */
  private getCurrentLanguage(): string {
    // This is a simple implementation - in a real app you might want to 
    // subscribe to language changes from the TranslationService
    return document.documentElement.getAttribute('lang') || 'vi';
  }
  
  /**
   * Load statistical card data
   */
  loadCardData(): void {
    this.dashboardService.getCardData().subscribe({
      next: (data) => {
        // Sử dụng trực tiếp dữ liệu từ service mà không cần map lại
        this.cardData = data;
      },
      error: (error) => {
        console.error('Error loading card data:', error);
      }
    });
  }
  
  /**
   * Load chart data based on selected period
   */
  loadChartData(): void {
    this.dashboardService.getRevenueChartData(this.selectedPeriod).subscribe({
      next: (data) => {
        this.chartData = data;
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
      }
    });
  }
  
  /**
   * Load recent orders data
   */
  loadRecentOrders(): void {
    this.dashboardService.getRecentOrders().subscribe({
      next: (data) => {
        this.recentOrders = data;
      },
      error: (error) => {
        console.error('Error loading recent orders:', error);
      }
    });
  }
  
  /**
   * Change chart time period and reload data
   */
  changePeriod(period: 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;
    this.loadChartData();
  }

  // Method to change active tab
  changeTab(tab: string): void {
    this.activeTab = tab;
    // Save the active tab to localStorage
    localStorage.setItem('activeTab', tab);
  }
}
