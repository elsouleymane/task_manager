export interface Task {
  task_id?: string;
  created_by: {
    username: string;
  };
  assigned_to: number;
  title: string;
  description: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}
