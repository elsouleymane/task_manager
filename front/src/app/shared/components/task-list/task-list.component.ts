import {Component, OnInit} from '@angular/core';
import {User} from '../../../core/models/user.model';
import {Task} from '../../../core/models/task.model';
import {TaskService} from '../../../core/services/task.service';
import {UserService} from '../../../core/services/user.service';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="task-list-container">
      <h2>Tasks</h2>
      <div class="task-actions">
        <button class="btn btn-primary" routerLink="/tasks/new">Add New Task</button>
      </div>

      <div class="task-filters">
        <label>
          Filter by Status:
          <select [(ngModel)]="statusFilter" (change)="applyFilters()">
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Filter by Assignee:
          <select [(ngModel)]="assigneeFilter" (change)="applyFilters()">
            <option value="">All</option>
            <option *ngFor="let user of users" [value]="user.id">{{ user.username }}</option>
          </select>
        </label>
      </div>

      <div *ngIf="loading" class="loading">Loading tasks...</div>

      <div *ngIf="!loading && filteredTasks.length === 0" class="no-tasks">
        No tasks found.
      </div>

      <div class="task-grid">
        <div *ngFor="let task of filteredTasks" class="task-card" [ngClass]="'status-' + task.status">
          <div class="task-header">
            <h3>{{ task.title }}</h3>
            <span class="task-status">{{ task.status }}</span>
          </div>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-meta">
            <div class="task-assignee">
              Assigned to: {{ getUserName(task.assigned_to) }}
            </div>
            <div class="task-creator">
              Created by: {{ task.created_by.username }}
            </div>
          </div>
          <div class="task-actions">
            <button class="btn btn-edit" [routerLink]="['/tasks', task.task_id]">Edit</button>
            <button class="btn btn-delete" (click)="deleteTask(task.task_id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [
    FormsModule,
    RouterLink,
    NgClass,
    NgForOf,
    NgIf
  ],
  styles: [`
    .task-list-container {
      padding: 20px;
    }

    .task-actions {
      margin-bottom: 20px;
    }

    .task-filters {
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
    }

    .task-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .task-card {
      border-radius: 5px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      border-left: 5px solid #ccc;
    }

    .status-todo {
      border-left-color: #ffc107;
    }

    .status-in-progress {
      border-left-color: #17a2b8;
    }

    .status-done {
      border-left-color: #28a745;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .task-status {
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 0.8rem;
      background-color: #f0f0f0;
    }

    .task-description {
      margin-bottom: 15px;
      color: #555;
    }

    .task-meta {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 15px;
    }

    .task-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-edit {
      background-color: #17a2b8;
      color: white;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .loading, .no-tasks {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  users: User[] = [];
  loading = true;
  statusFilter = '';
  assigneeFilter = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId.toString());
    return user ? user.username : 'Unknown';
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      let matchesStatus = true;
      let matchesAssignee = true;

      if (this.statusFilter) {
        matchesStatus = task.status === this.statusFilter;
      }

      if (this.assigneeFilter) {
        matchesAssignee = task.assigned_to.toString() === this.assigneeFilter;
      }

      return matchesStatus && matchesAssignee;
    });
  }

  deleteTask(taskId?: string): void {
    if (!taskId) return;

    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.task_id !== taskId);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }
}
