import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderViewModel } from '../../types/order';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  // Orders data
  orders: OrderViewModel[] = [];
  filteredOrders: OrderViewModel[] = [];
  searchQuery: string = '';
  
  // Loading state
  loading: boolean = false;
  processingAction: boolean = false;
  
  // Form and modal
  orderForm: FormGroup;
  showModal: boolean = false;
  modalTitle: string = '';
  currentOrderId: number | null = null;
  
  // Status options
  statusOptions = [
    { value: 0, label: 'orderStatusFailed' },
    { value: 1, label: 'orderStatusPending' },
    { value: 2, label: 'orderStatusCompleted' }
  ];
  
  // Notification
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    this.orderForm = this.fb.group({
      customer_name: ['', [Validators.required]],
      product_id: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: [1, [Validators.required]],
      order_date: [new Date().toISOString().split('T')[0], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Load all orders from the API
   */
  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().pipe(
      catchError(error => {
        this.loading = false;
        this.notificationMessage = this.translationService.get('errorLoadingOrders');
        this.notificationType = 'error';
        this.showNotification = true;
        return throwError(() => new Error(error));
      })
    ).subscribe(orders => {
      this.orders = orders.map(order => this.transformToViewModel(order));
      this.filteredOrders = [...this.orders];
      this.loading = false;
    });
  }

  /**
   * Transform API order model to view model
   */
  transformToViewModel(order: Order): OrderViewModel {
    // Create the view model with appropriate status from the order
    return {
      ...order,
      status: order.status !== undefined ? order.status : 1 // Default to status 1 (Đang chờ) if not provided
    };
  }

  /**
   * Search orders by query
   */
  searchOrders(): void {
    if (!this.searchQuery.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredOrders = this.orders.filter(order => 
      order.customer_name.toLowerCase().includes(query) ||
      order.id?.toString().includes(query) ||
      order.order_date.includes(query) ||
      order.status.toString().includes(query)
    );
  }

  /**
   * Reset search
   */
  resetSearch(): void {
    this.searchQuery = '';
    this.filteredOrders = [...this.orders];
  }

  /**
   * Open modal to add new order
   */
  openAddModal(): void {
    this.modalTitle = this.translationService.get('addOrder');
    this.currentOrderId = null;
    this.orderForm.reset({
      customer_name: '',
      product_id: '',
      quantity: 1,
      status: 1,
      order_date: new Date().toISOString().split('T')[0]
    });
    this.showModal = true;
  }

  /**
   * Open modal to edit existing order
   */
  openEditModal(order: OrderViewModel): void {
    this.modalTitle = this.translationService.get('editOrder');
    this.currentOrderId = order.id!;
    this.orderForm.patchValue({
      customer_name: order.customer_name,
      product_id: order.product_id,
      quantity: order.quantity,
      status: order.status,
      order_date: order.order_date
    });
    this.showModal = true;
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.showModal = false;
  }

  /**
   * Save order (create or update)
   */
  saveOrder(): void {
    if (this.orderForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.orderForm.controls).forEach(key => {
        const control = this.orderForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.processingAction = true;
    const orderData: Order = this.orderForm.value;

    if (this.currentOrderId) {
      // Update existing order
      this.orderService.updateOrder(this.currentOrderId, orderData).pipe(
        catchError(error => {
          this.processingAction = false;
          this.notificationMessage = this.translationService.get('errorUpdatingOrder');
          this.notificationType = 'error';
          this.showNotification = true;
          return throwError(() => new Error(error));
        })
      ).subscribe({
        next: (updatedOrder) => {
          this.handleSuccess(this.translationService.get('orderUpdatedSuccess'));
        },
        error: (error) => {
          this.handleError(this.translationService.get('generalError'), error);
        }
      });
    } else {
      // Create new order
      this.orderService.createOrder(orderData).pipe(
        catchError(error => {
          this.processingAction = false;
          this.notificationMessage = this.translationService.get('errorCreatingOrder');
          this.notificationType = 'error';
          this.showNotification = true;
          return throwError(() => new Error(error));
        })
      ).subscribe({
        next: (newOrder) => {
          this.handleSuccess(this.translationService.get('orderCreatedSuccess'));
        },
        error: (error) => {
          this.handleError(this.translationService.get('generalError'), error);
        }
      });
    }
  }

  /**
   * Delete order after confirmation
   */
  deleteOrder(order: OrderViewModel): void {
    if (!confirm(this.translationService.get('confirmDeleteOrder').replace('{id}', order.id!.toString()))) {
      return;
    }

    this.processingAction = true;
    this.orderService.deleteOrder(order.id!).pipe(
      catchError(error => {
        this.processingAction = false;
        this.notificationMessage = this.translationService.get('errorDeletingOrder');
        this.notificationType = 'error';
        this.showNotification = true;
        return throwError(() => new Error(error));
      })
    ).subscribe({
      next: () => {
        this.handleSuccess(this.translationService.get('orderDeletedSuccess'));
      },
      error: (error) => {
        this.handleError(this.translationService.get('generalError'), error);
      }
    });
  }

  /**
   * Display notification message
   */
  showNotificationMessage(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  /**
   * Handle successful API operation
   */
  private handleSuccess(message: string): void {
    this.showNotificationMessage(message, 'success');
    this.closeModal();
    this.loadOrders();
    this.processingAction = false;
  }

  /**
   * Handle API error
   */
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.showNotificationMessage(this.translationService.get('generalError'), 'error');
    this.processingAction = false;
  }
} 