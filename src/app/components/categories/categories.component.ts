import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

interface CategoryViewModel extends Category {
  products: number;
  status_text: 'active' | 'inactive'; // Renamed from status to avoid conflict
  createdAt: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: CategoryViewModel[] = [];
  filteredCategories: CategoryViewModel[] = [];
  searchQuery: string = '';
  currentCategory: CategoryViewModel | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  isFormVisible: boolean = false;
  
  // Form model for new/edit category
  categoryForm: CategoryViewModel = {
    id: 0,
    category_name: '',
    slug: '',
    description: '',
    status: 1, // Default active status as number
    products: 0,
    status_text: 'active',
    createdAt: ''
  };

  constructor(
    private categoryService: CategoryService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Load categories data from API
   */
  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        // Transform API data to view model
        this.categories = data.map(cat => ({
          id: cat.id || 0,
          category_name: cat.category_name,
          slug: cat.slug,
          description: cat.description || '', // Now coming from API
          status: cat.status, // Numeric status from API
          products: 0, // Default value as it's not in the API
          status_text: cat.status === 1 ? 'active' : 'inactive', // Convert numeric status to text
          createdAt: new Date().toISOString().split('T')[0] // Default value
        }));
        this.filteredCategories = [...this.categories];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.isLoading = false;
      }
    });
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
      category => category.category_name.toLowerCase().includes(query) || 
                  (category.description && category.description.toLowerCase().includes(query))
    );
  }

  /**
   * Open modal to add new category
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.isFormVisible = true;
    this.categoryForm = {
      id: 0,
      category_name: '',
      slug: '',
      description: '',
      status: 1, // Default active status as number
      products: 0,
      status_text: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    // In a real application, this would show a modal dialog
  }

  /**
   * Open modal to edit category
   */
  openEditModal(category: CategoryViewModel): void {
    this.isEditMode = true;
    this.isFormVisible = true;
    this.currentCategory = category;
    this.categoryForm = { ...category };
    // In a real application, this would show a modal dialog
  }

  /**
   * Save category (add or update)
   */
  saveCategory(): void {
    if (!this.categoryForm.category_name || !this.categoryForm.slug) {
      this.errorMessage = 'Category name and slug are required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Prepare data for API
    const categoryData: Category = {
      category_name: this.categoryForm.category_name,
      slug: this.categoryForm.slug,
      description: this.categoryForm.description,
      status: this.categoryForm.status_text === 'active' ? 1 : 0 // Convert text status back to number
    };

    if (this.isEditMode && this.currentCategory && this.currentCategory.id) {
      // Update existing category
      this.categoryService.updateCategory(this.currentCategory.id, categoryData).subscribe({
        next: (updatedCategory) => {
          const index = this.categories.findIndex(c => c.id === this.currentCategory!.id);
          if (index !== -1) {
            // Keep local properties and update with API response
            this.categories[index] = {
              ...this.categories[index],
              category_name: updatedCategory.category_name,
              slug: updatedCategory.slug,
              description: updatedCategory.description || '',
              status: updatedCategory.status || this.categories[index].status,
              status_text: (updatedCategory.status === 1) ? 'active' : 'inactive'
            };
          }
          this.handleSuccess('Category updated successfully');
        },
        error: (error) => this.handleError('Failed to update category', error)
      });
    } else {
      // Add new category
      this.categoryService.createCategory(categoryData).subscribe({
        next: (newCategory) => {
          // Calculate a new ID safely
          const maxId = this.categories.length > 0 
            ? Math.max(...this.categories.map(c => c.id || 0)) 
            : 0;
          
          const categoryViewModel: CategoryViewModel = {
            id: newCategory.id || (maxId + 1),
            category_name: newCategory.category_name,
            slug: newCategory.slug,
            description: newCategory.description || '',
            status: newCategory.status || 1,
            products: 0,
            status_text: (newCategory.status === 1) ? 'active' : 'inactive',
            createdAt: new Date().toISOString().split('T')[0]
          };
          this.categories.push(categoryViewModel);
          this.handleSuccess('Category added successfully');
        },
        error: (error) => this.handleError('Failed to add category', error)
      });
    }
  }

  /**
   * Delete category
   */
  deleteCategory(id: number): void {
    // In a real app, show confirmation modal first
    this.isLoading = true;
    this.errorMessage = '';
    
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        // Reload the categories data from the API
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.errorMessage = 'Failed to delete category. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Toggle category status
   */
  toggleStatus(category: CategoryViewModel): void {
    // Toggle between 1 (active) and 0 (inactive)
    const newStatus = category.status === 1 ? 0 : 1;
    
    // Check if the category has an ID
    if (category.id) {
      this.isLoading = true;
      
      // Prepare data for API
      const categoryData: Category = {
        category_name: category.category_name,
        slug: category.slug,
        description: category.description,
        status: newStatus
      };
      
      // Update via API
      this.categoryService.updateCategory(category.id, categoryData).subscribe({
        next: () => {
          // Reload the categories data from the API
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error updating category status:', error);
          this.errorMessage = 'Failed to update category status. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Handle successful API operations
   */
  private handleSuccess(message: string): void {
    console.log(message);
    
    // Reload the categories data from the API to ensure fresh data
    this.loadCategories();
    
    // Reset the form and hide it
    this.resetForm();
    this.isLoading = false;
    this.isFormVisible = false;
    
    // Display a success message to the user
    this.errorMessage = ''; // Clear any error messages
    // You could add a success message display here if desired
  }

  /**
   * Refresh categories data without changing the active tab
   */
  refreshCategories(): void {
    // Only update the filtered categories based on existing data
    this.filteredCategories = [...this.categories];
    
    // Apply current search filter if any
    if (this.searchQuery.trim()) {
      this.searchCategories();
    }
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
    this.categoryForm = {
      id: 0,
      category_name: '',
      slug: '',
      description: '',
      status: 1, // Default active status as number
      products: 0,
      status_text: 'active',
      createdAt: ''
    };
    this.currentCategory = null;
    this.isEditMode = false;
    this.isFormVisible = false;
    this.errorMessage = '';
  }

  /**
   * Auto-generate a slug from the category name
   */
  generateSlug(): void {
    if (this.categoryForm.category_name) {
      // Convert to lowercase, replace spaces with hyphens, and remove special characters
      this.categoryForm.slug = this.categoryForm.category_name
        .toLowerCase()
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '')      // Remove non-word chars except hyphens
        .replace(/\-\-+/g, '-')        // Replace multiple hyphens with single hyphen
        .replace(/^-+/, '')            // Trim hyphens from start
        .replace(/-+$/, '');           // Trim hyphens from end
    } else {
      this.categoryForm.slug = '';
    }
  }
} 