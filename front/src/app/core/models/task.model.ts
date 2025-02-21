export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
}
