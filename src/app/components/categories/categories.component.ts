import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
  description: string;
  products: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchQuery: string = '';
  currentCategory: Category | null = null;
  isEditMode: boolean = false;
  
  // Form model for new/edit category
  categoryForm: Category = {
    id: 0,
    name: '',
    description: '',
    products: 0,
    status: 'active',
    createdAt: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Load categories data
   */
  loadCategories(): void {
    // Mock data - replace with API call in real application
    this.categories = [
      {
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        products: 120,
        status: 'active',
        createdAt: '2023-01-15'
      },
      {
        id: 2,
        name: 'Clothing',
        description: 'All types of clothing and accessories',
        products: 85,
        status: 'active',
        createdAt: '2023-01-20'
      },
      {
        id: 3,
        name: 'Books',
        description: 'Books, magazines and publications',
        products: 65,
        status: 'active',
        createdAt: '2023-02-05'
      },
      {
        id: 4,
        name: 'Home & Kitchen',
        description: 'Home appliances and kitchen utilities',
        products: 92,
        status: 'active',
        createdAt: '2023-02-12'
      },
      {
        id: 5,
        name: 'Sports',
        description: 'Sports equipment and accessories',
        products: 45,
        status: 'inactive',
        createdAt: '2023-03-01'
      }
    ];
    this.filteredCategories = [...this.categories];
  }

  /**
   * Search categories based on name
   */
  searchCategories(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(
      category => category.name.toLowerCase().includes(query) || 
                  category.description.toLowerCase().includes(query)
    );
  }

  /**
   * Open modal to add new category
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.categoryForm = {
      id: 0,
      name: '',
      description: '',
      products: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    // In a real application, this would show a modal dialog
  }

  /**
   * Open modal to edit category
   */
  openEditModal(category: Category): void {
    this.isEditMode = true;
    this.currentCategory = category;
    this.categoryForm = { ...category };
    // In a real application, this would show a modal dialog
  }

  /**
   * Save category (add or update)
   */
  saveCategory(): void {
    if (this.isEditMode && this.currentCategory) {
      // Update existing category
      const index = this.categories.findIndex(c => c.id === this.currentCategory!.id);
      if (index !== -1) {
        this.categories[index] = { ...this.categoryForm };
      }
    } else {
      // Add new category
      const newCategory: Category = {
        ...this.categoryForm,
        id: Math.max(0, ...this.categories.map(c => c.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.categories.push(newCategory);
    }
    
    // Reset and refresh list
    this.filteredCategories = [...this.categories];
    this.resetForm();
  }

  /**
   * Delete category
   */
  deleteCategory(id: number): void {
    // In a real app, show confirmation modal first
    this.categories = this.categories.filter(c => c.id !== id);
    this.filteredCategories = [...this.categories];
  }

  /**
   * Toggle category status
   */
  toggleStatus(category: Category): void {
    category.status = category.status === 'active' ? 'inactive' : 'active';
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.categoryForm = {
      id: 0,
      name: '',
      description: '',
      products: 0,
      status: 'active',
      createdAt: ''
    };
    this.currentCategory = null;
    this.isEditMode = false;
  }
} 