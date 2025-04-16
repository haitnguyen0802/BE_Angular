import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of, map } from 'rxjs';
import { OrderService } from './order.service';
import { Order as ApiOrder } from '../types/order';
import { TranslationService } from './translation.service';

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

  constructor(
    private apiService: ApiService, 
    private orderService: OrderService,
    private translationService: TranslationService
  ) { }

  /**
   * Get statistical card data
   * @returns Observable of card data array
   */
  getCardData(): Observable<CardData[]> {
    // Sử dụng OrderService để lấy dữ liệu thực
    return this.orderService.getOrders().pipe(
      map(orders => {
        // Tính toán các số liệu thống kê
        const totalOrders = orders.length;
        const successfulOrders = orders.filter(order => order.status === 2).length;
        const pendingOrders = orders.filter(order => order.status === 1).length;
        
        // Tính tổng doanh thu (giả định dựa trên số lượng)
        const totalRevenue = orders.reduce((sum, order) => 
          sum + (order.quantity * 100), 0);
        
        return [
          {
            title: 'cardTotalOrders',
            value: totalOrders.toString(),
            change: 12.5,
            icon: 'fa-shopping-bag'
          },
          {
            title: 'completed',
            value: successfulOrders.toString(),
            change: 8.2,
            icon: 'fa-check-circle'
          },
          {
            title: 'cardTotalRevenue',
            value: totalRevenue.toFixed(2),
            change: 5.3,
            icon: 'fa-chart-line'
          },
          {
            title: 'pending',
            value: pendingOrders.toString(),
            change: -3.8,
            icon: 'fa-clock'
          }
        ];
      })
    );
  }

  /**
   * Get revenue chart data
   * @param period Time period (week, month, year)
   * @returns Observable of chart data
   */
  getRevenueChartData(period: 'week' | 'month' | 'year'): Observable<ChartData> {
    return this.orderService.getOrders().pipe(
      map(orders => {
        // Định nghĩa cấu trúc labels dựa vào period
        let labels: string[];
        let data: number[] = [];
        const currentDate = new Date();
        
        switch (period) {
          case 'week':
            // Sử dụng tiêu chuẩn quốc tế cho ngày trong tuần
            // (ISO 8601: 1 = Monday, 7 = Sunday)
            labels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => 
              this.translationService.get(day)
            );
            
            // Khởi tạo mảng dữ liệu với 0
            data = Array(7).fill(0);
            
            // Tính toán doanh thu theo ngày trong tuần
            orders.forEach(order => {
              const orderDate = new Date(order.order_date);
              // Chỉ xét các đơn hàng trong tuần hiện tại
              if (this.isCurrentWeek(orderDate, currentDate)) {
                // Lấy ngày trong tuần (0 = CN, 1 = T2, ..., 6 = T7)
                let dayOfWeek = orderDate.getDay(); 
                // Chuyển từ 0-6 (CN-T7) sang 0-6 (T2-CN)
                dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                // Cộng dồn doanh thu
                data[dayOfWeek] += order.quantity * 100;
              }
            });
            break;
            
          case 'month':
            // Labels cho các tuần trong tháng - dùng chuỗi có thể dịch
            labels = [
              this.translationService.get('week') + ' 1',
              this.translationService.get('week') + ' 2',
              this.translationService.get('week') + ' 3',
              this.translationService.get('week') + ' 4'
            ];
            
            // Khởi tạo mảng dữ liệu với 0
            data = Array(4).fill(0);
            
            // Tính toán doanh thu theo tuần trong tháng
            orders.forEach(order => {
              const orderDate = new Date(order.order_date);
              // Chỉ xét các đơn hàng trong tháng hiện tại
              if (orderDate.getMonth() === currentDate.getMonth() && 
                  orderDate.getFullYear() === currentDate.getFullYear()) {
                // Xác định tuần trong tháng (1-4)
                const weekOfMonth = Math.ceil(orderDate.getDate() / 7) - 1;
                // Cộng dồn doanh thu
                if (weekOfMonth >= 0 && weekOfMonth < 4) {
                  data[weekOfMonth] += order.quantity * 100;
                }
              }
            });
            break;
            
          case 'year':
            // Sử dụng tiêu chuẩn quốc tế cho tháng
            // (1-12 = January to December)
            labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(month => 
              this.translationService.get(month)
            );
            
            // Khởi tạo mảng dữ liệu với 0
            data = Array(12).fill(0);
            
            // Tính toán doanh thu theo tháng trong năm
            orders.forEach(order => {
              const orderDate = new Date(order.order_date);
              // Chỉ xét các đơn hàng trong năm hiện tại
              if (orderDate.getFullYear() === currentDate.getFullYear()) {
                // Lấy tháng (0-11)
                const month = orderDate.getMonth();
                // Cộng dồn doanh thu
                data[month] += order.quantity * 100;
              }
            });
            break;
        }
        
        return {
          labels,
          datasets: [{
            label: this.translationService.get('revenue'),  // Sử dụng dịch thay vì chuỗi cứng
            data,
            backgroundColor: 'rgba(78, 115, 223, 0.1)',
            borderColor: '#4e73df',
            borderWidth: 2
          }]
        };
      })
    );
  }

  /**
   * Kiểm tra xem một ngày có trong tuần hiện tại không
   */
  private isCurrentWeek(date: Date, currentDate: Date): boolean {
    // Clone currentDate để không thay đổi giá trị gốc
    const clonedDate = new Date(currentDate);
    
    // Lấy ngày đầu tiên của tuần hiện tại (Thứ 2)
    let first = clonedDate.getDate() - clonedDate.getDay() + 1;
    if (clonedDate.getDay() === 0) first -= 6; // Nếu hôm nay là CN
    
    const firstDayOfWeek = new Date(clonedDate);
    firstDayOfWeek.setDate(first);
    firstDayOfWeek.setHours(0, 0, 0, 0);
    
    // Lấy ngày cuối cùng của tuần (Chủ nhật)
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    
    // Kiểm tra xem ngày được chọn có nằm trong tuần hiện tại không
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }

  /**
   * Get recent orders data
   * @returns Observable of orders array
   */
  getRecentOrders(): Observable<Order[]> {
    // Sử dụng OrderService thay vì mock data
    return this.orderService.getOrders().pipe(
      map(apiOrders => {
        // Chuyển đổi từ API Order sang Order format cho dashboard
        // Chỉ lấy 5 đơn hàng gần nhất
        return apiOrders.slice(0, 5).map(order => ({
          id: `#ORD-${order.id?.toString().padStart(3, '0')}`,
          customer: order.customer_name,
          date: new Date(order.order_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          // Giả định một giá trị amount dựa trên số lượng
          amount: (order.quantity * 100).toFixed(2),
          status: order.status !== undefined ? order.status : 1
        }));
      })
    );
  }
} 