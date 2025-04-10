import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

// Define interfaces for dashboard data
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface CardData {
  title: string;
  value: string;
  change: number;
  icon: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) { }

  /**
   * Get statistical card data
   * @returns Observable of card data array
   */
  getCardData(): Observable<CardData[]> {
    // Mock data - replace with API call when backend is ready
    // Example: return this.apiService.get<CardData[]>('dashboard/cards');
    return of([
      {
        title: 'Total Users',
        value: '1,452',
        change: 12.5,
        icon: 'fa-users'
      },
      {
        title: 'Total Sales',
        value: '$24,500',
        change: 8.2,
        icon: 'fa-shopping-bag'
      },
      {
        title: 'Revenue',
        value: '$18,260',
        change: 5.3,
        icon: 'fa-chart-line'
      },
      {
        title: 'Tickets',
        value: '42',
        change: -3.8,
        icon: 'fa-ticket-alt'
      }
    ]);
  }

  /**
   * Get revenue chart data
   * @param period Time period (week, month, year)
   * @returns Observable of chart data
   */
  getRevenueChartData(period: 'week' | 'month' | 'year'): Observable<ChartData> {
    // Mock data - replace with API call when backend is ready
    // Example: return this.apiService.get<ChartData>(`dashboard/revenue-chart?period=${period}`);
    
    let labels: string[];
    let data: number[];
    
    switch (period) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [2100, 3200, 2800, 4300, 2900, 3500, 3800];
        break;
      case 'month':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [12500, 15800, 14200, 18500];
        break;
      case 'year':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data = [25000, 32000, 28000, 43000, 38000, 32500, 36000, 48000, 42000, 49000, 53000, 58000];
        break;
    }
    
    return of({
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        backgroundColor: 'rgba(78, 115, 223, 0.1)',
        borderColor: '#4e73df',
        borderWidth: 2
      }]
    });
  }

  /**
   * Get recent orders data
   * @returns Observable of orders array
   */
  getRecentOrders(): Observable<Order[]> {
    // Mock data - replace with API call when backend is ready
    // Example: return this.apiService.get<Order[]>('dashboard/recent-orders');
    return of([
      {
        id: '#ORD-001',
        customer: 'John Smith',
        date: '24 Apr, 2023',
        amount: '$120.00',
        status: 'completed'
      },
      {
        id: '#ORD-002',
        customer: 'Sarah Johnson',
        date: '23 Apr, 2023',
        amount: '$245.50',
        status: 'pending'
      },
      {
        id: '#ORD-003',
        customer: 'Michael Brown',
        date: '22 Apr, 2023',
        amount: '$190.25',
        status: 'completed'
      },
      {
        id: '#ORD-004',
        customer: 'Emma Wilson',
        date: '21 Apr, 2023',
        amount: '$85.00',
        status: 'cancelled'
      },
      {
        id: '#ORD-005',
        customer: 'David Lee',
        date: '20 Apr, 2023',
        amount: '$310.75',
        status: 'completed'
      }
    ]);
  }
} 