export interface Order {
  id?: number;
  customer_name: string;
  product_id: number;
  quantity: number;
  order_date: string;
  status?: number; // 0: Failed/Cancelled, 1: Pending, 2: Completed
}

export interface OrderViewModel extends Order {
  // Additional view-specific properties
  status: number; // 0: Failed/Cancelled, 1: Pending, 2: Completed
  amount?: string;
  product_name?: string;
} 