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
        this.filteredProducts = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.product_name.toLowerCase().includes(term) || 
      product.product_code.toLowerCase().includes(term)
    );
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