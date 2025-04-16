export interface User {
  id?: number;
  full_name: string;
  username: string;
  password?: string;  // Optional for updates, required for creation
  email: string;
  phone_number: string;
  date_of_birth?: string;
  gender?: string;
  address1?: string;
  address2?: string;
  created_at?: string;
}

export interface UserViewModel extends User {
  // Any additional view-specific properties can be added here
  // We won't need to modify the base fields for display in this case
} 