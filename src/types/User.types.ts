export interface UserProps {
  id: number;
  name: string;
  email: string;
  password: string;
  cashier: number;
  role: 'admin' | 'user' | 'manager' | 'employee';
  games: any[];
  group: any[];
  created_at: Date;
  updated_at: Date;
}
