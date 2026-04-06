export type ExpenseCategory = 
  | 'Housing' 
  | 'Food' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Lifestyle' 
  | 'Other';

export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export interface BaseRecord {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Expense extends BaseRecord {
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  recurrence: RecurrenceType;
}

export interface ExpenseFormData {
  category: ExpenseCategory;
  amount: string; 
  date: string;
  description: string;
  recurrence: RecurrenceType;
}

export interface Budget extends BaseRecord {
  month: number;
  year: number;
  amount: number;
}

export interface BudgetFormData {
  month: number;
  year: number;
  amount: string;
}