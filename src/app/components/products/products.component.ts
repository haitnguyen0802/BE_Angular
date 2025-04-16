import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productForm: FormGroup;
  isLoading: boolean = false;
  isEditing: boolean = false;
  showModal: boolean = false;
  showDeleteConfirm: boolean = false;
  searchTerm: string = '';
  filteredProducts: Product[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  
  // Sorting properties
  sortField: string = 'product_name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_code: ['', Validators.required],
      price: ['', Validators.required],
      material: ['', Validators.required],
      colors: ['', Validators.required],
      size: ['', Validators.required],
      status: ['Đang Có Sẵn', Validators.required],
      image_url: ['', Validators.required],
      description: [''],
      slug: ['', Validators.required],
      category_id: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  searchProducts(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.applyFilters();
  }
  
  // Apply all filters (search, sort) and pagination
  applyFilters(): void {
    // First apply search filter
    let results = this.products;
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      results = results.filter(product => 
        product.product_name.toLowerCase().includes(term) || 
        product.product_code.toLowerCase().includes(term)
      );
    }
    
    // Then apply sorting
    results = this.sortProducts(results);
    
    // Calculate total pages
    this.totalPages = Math.ceil(results.length / this.pageSize);
    
    // Ensure current page is valid
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = results.slice(startIndex, startIndex + this.pageSize);
  }
  
  // Sort products based on current sort settings
  sortProducts(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      // Handle numeric sorting for price
      if (this.sortField === 'price') {
        const aValue = parseFloat(a.price);
        const bValue = parseFloat(b.price);
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string sorting for other fields
      let aValue = '';
      let bValue = '';
      
      switch(this.sortField) {
        case 'product_name':
          aValue = a.product_name.toLowerCase();
          bValue = b.product_name.toLowerCase();
          break;
        case 'product_code':
          aValue = a.product_code.toLowerCase();
          bValue = b.product_code.toLowerCase();
          break;
        case 'material':
          aValue = a.material.toLowerCase();
          bValue = b.material.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          aValue = a.product_name.toLowerCase();
          bValue = b.product_name.toLowerCase();
      }
      
      if (this.sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }
  
  // Change sort field and/or direction
  changeSort(field: string): void {
    if (this.sortField === field) {
      // Toggle direction if clicking the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new field and default to ascending
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }
  
  // Go to a specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.applyFilters();
    }
  }
  
  // Get array of page numbers for pagination controls
  getPageNumbers(): number[] {
    const pageNumbers = [];
    const totalPagesToShow = 5; // Show 5 page numbers maximum
    
    if (this.totalPages <= totalPagesToShow) {
      // If we have 5 or fewer pages, show all
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Calculate which page numbers to show
      let startPage = Math.max(this.currentPage - Math.floor(totalPagesToShow / 2), 1);
      const endPage = Math.min(startPage + totalPagesToShow - 1, this.totalPages);
      
      // Adjust start page if we're near the end
      if (endPage - startPage + 1 < totalPagesToShow) {
        startPage = Math.max(endPage - totalPagesToShow + 1, 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  }

  openAddModal(): void {
    this.isEditing = false;
    this.productForm.reset({
      status: 'Đang Có Sẵn',
      category_id: 0
    });
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditing = true;
    this.selectedProduct = product;
    this.productForm.patchValue({
      product_name: product.product_name,
      product_code: product.product_code,
      price: product.price,
      material: product.material,
      colors: product.colors,
      size: product.size,
      status: product.status,
      image_url: product.image_url,
      description: product.description,
      slug: product.slug,
      category_id: product.category_id
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
  }

  openDeleteConfirm(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.selectedProduct = null;
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    const productData: Product = this.productForm.value;
    
    this.isLoading = true;
    
    if (this.isEditing && this.selectedProduct?.id) {
      // Update existing product
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.isLoading = false;
        }
      });
    } else {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.isLoading = false;
        }
      });
    }
  }

  deleteProduct(): void {
    if (!this.selectedProduct?.id) return;
    
    this.isLoading = true;
    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.loadProducts();
        this.closeDeleteConfirm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.isLoading = false;
      }
    });
  }

  // Helper method to format price
  formatPrice(price: string): string {
    return parseFloat(price).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  }
} 