import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, CardData, Order, ChartData } from '../../services/dashboard.service';
import { ChartComponent } from '../chart/chart.component';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';
import { CategoriesComponent } from '../categories/categories.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartComponent, FormsModule, ProductsComponent, CategoriesComponent],
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
  
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadCardData();
    this.loadChartData();
    this.loadRecentOrders();
  }
  
  /**
   * Load statistical card data
   */
  loadCardData(): void {
    this.dashboardService.getCardData().subscribe({
      next: (data) => {
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
  }
}
