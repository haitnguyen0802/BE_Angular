import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, UserViewModel } from '../../types/user';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: UserViewModel[] = [];
  filteredCustomers: UserViewModel[] = [];
  searchQuery: string = '';
  currentCustomer: UserViewModel | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  isFormVisible: boolean = false;
  
  // Form model for new/edit customer
  customerForm: UserViewModel = {
    id: 0,
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address1: '',
    address2: '',
    created_at: ''
  };

  constructor(
    private userService: UserService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  /**
   * Load customers data from API
   */
  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUsers().subscribe({
      next: (data) => {
        // Transform API data to view model if needed
        this.customers = data;
        this.filteredCustomers = [...this.customers];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Failed to load customers. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Search customers based on name, email, or phone
   */
  searchCustomers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCustomers = [...this.customers];
      return;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCustomers = this.customers.filter(
      customer => 
        customer.full_name.toLowerCase().includes(query) || 
        customer.email.toLowerCase().includes(query) ||
        customer.phone_number.includes(query)
    );
  }

  /**
   * Open modal to add new customer
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.isFormVisible = true;
    this.customerForm = {
      id: 0,
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      address1: '',
      address2: '',
      created_at: new Date().toISOString()
    };
  }

  /**
   * Open modal to edit customer
   */
  openEditModal(customer: UserViewModel): void {
    this.isEditMode = true;
    this.isFormVisible = true;
    this.currentCustomer = customer;
    // Create a copy of customer but without the password
    this.customerForm = { 
      ...customer,
      password: '' // Clear password for security reasons when editing
    };
  }

  /**
   * Save customer (add or update)
   */
  saveCustomer(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Prepare data for API
    const userData: User = { ...this.customerForm };
    
    // Remove empty password on update
    if (this.isEditMode && !userData.password) {
      delete userData.password;
    }

    if (this.isEditMode && this.currentCustomer && this.currentCustomer.id) {
      // Update existing customer
      this.userService.updateUser(this.currentCustomer.id, userData).subscribe({
        next: () => {
          this.handleSuccess('Customer updated successfully');
        },
        error: (error) => this.handleError('Failed to update customer', error)
      });
    } else {
      // Add new customer
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.handleSuccess('Customer added successfully');
        },
        error: (error) => this.handleError('Failed to add customer', error)
      });
    }
  }

  /**
   * Delete customer
   */
  deleteCustomer(id: number): void {
    // In a real app, show confirmation modal first
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.deleteUser(id).subscribe({
      next: () => {
        // Reload the customers data from the API
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
        this.errorMessage = 'Failed to delete customer. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Validate the customer form
   */
  validateForm(): boolean {
    if (!this.customerForm.full_name || 
        !this.customerForm.username || 
        !this.customerForm.email || 
        !this.customerForm.phone_number) {
      this.errorMessage = 'Full name, username, email, and phone number are required.';
      return false;
    }

    // When adding a new customer, password is required
    if (!this.isEditMode && !this.customerForm.password) {
      this.errorMessage = 'Password is required for new customers.';
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customerForm.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

    // Phone validation (basic check for Vietnam phone numbers)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(this.customerForm.phone_number)) {
      this.errorMessage = 'Please enter a valid phone number (10-11 digits).';
      return false;
    }

    return true;
  }

  /**
   * Format date to API format (yyyy-MM-dd)
   */
  formatDateForApi(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString();
  }

  /**
   * Handle successful API operations
   */
  private handleSuccess(message: string): void {
    console.log(message);
    
    // Reload the customers data from the API to ensure fresh data
    this.loadCustomers();
    
    // Reset the form and hide it
    this.resetForm();
    this.isLoading = false;
    this.isFormVisible = false;
    
    // Display a success message to the user
    this.errorMessage = ''; // Clear any error messages
  }

  /**
   * Handle API errors
   */
  private handleError(message: string, error: any): void {
    console.error(`${message}:`, error);
    this.errorMessage = `${message}. Please try again.`;
    this.isLoading = false;
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.customerForm = {
      id: 0,
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      address1: '',
      address2: '',
      created_at: ''
    };
    this.currentCustomer = null;
    this.isEditMode = false;
    this.isFormVisible = false;
    this.errorMessage = '';
  }

  /**
   * Format date for display (MM/DD/YYYY)
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString();
  }
} 