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
  status: number; // 0: Thất bại/Hủy, 1: Đang chờ, 2: Thành công
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
        title: 'Tổng đơn hàng',
        value: '5',
        change: 12.5,
        icon: 'fa-shopping-bag'
      },
      {
        title: 'Đơn hàng thành công',
        value: '3',
        change: 8.2,
        icon: 'fa-check-circle'
      },
      {
        title: 'Doanh thu',
        value: '$951.50',
        change: 5.3,
        icon: 'fa-chart-line'
      },
      {
        title: 'Đơn hàng đang chờ',
        value: '1',
        change: -3.8,
        icon: 'fa-clock'
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
        labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        data = [120, 245.5, 190.25, 85, 310.75, 0, 0];
        break;
      case 'month':
        labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
        data = [350.5, 401, 200, 0];
        break;
      case 'year':
        labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        data = [0, 0, 951.5, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        break;
    }
    
    return of({
      labels,
      datasets: [{
        label: 'Doanh thu',
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
        customer: 'Nguyễn Văn A',
        date: '31 Mar, 2025',
        amount: '$120.00',
        status: 2 // Thành công
      },
      {
        id: '#ORD-002',
        customer: 'Sarah Johnson',
        date: '23 Apr, 2023',
        amount: '$245.50',
        status: 1 // Đang chờ
      },
      {
        id: '#ORD-003',
        customer: 'Michael Brown',
        date: '22 Apr, 2023',
        amount: '$190.25',
        status: 2 // Thành công
      },
      {
        id: '#ORD-004',
        customer: 'Emma Wilson',
        date: '21 Apr, 2023',
        amount: '$85.00',
        status: 0 // Thất bại/Hủy
      },
      {
        id: '#ORD-005',
        customer: 'David Lee',
        date: '20 Apr, 2023',
        amount: '$310.75',
        status: 2 // Thành công
      }
    ]);
  }
} 