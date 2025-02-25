import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {User} from '../../../core/models/user.model';
import { Task } from '../../../core/models/task.model';
import {TaskService} from '../../../core/services/task.service';
import {UserService} from '../../../core/services/user.service';
import {AuthService} from '../../../core/services/auth.service';


@Component({
  selector: 'app-task-form',
  template: `
    <div class="task-form-container">
      <h2>{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</h2>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" formControlName="title" class="form-control">
          <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="error-message">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" class="form-control" rows="4"></textarea>
          <div *ngIf="taskForm.get('description')?.invalid && taskForm.get('description')?.touched"
               class="error-message">
            Description is required
          </div>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" formControlName="status" class="form-control">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div class="form-group">
          <label for="assigned_to">Assign To</label>
          <div class="user-assignment-container">
            <select id="assigned_to" formControlName="assigned_to" class="form-control">
              <option *ngFor="let user of users" [value]="user.id">{{ user.username }}</option>
            </select>

            <div class="user-avatars">
              <div *ngFor="let user of users"
                   [ngClass]="{'user-avatar': true, 'selected': taskForm.get('assigned_to')?.value == user.id}"
                   (click)="assignToUser(user.id)">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="taskForm.invalid || loading" class="btn btn-primary">
            {{ isEditMode ? 'Update' : 'Create' }} Task
          </button>
          <button type="button" routerLink="/dashboard" class="btn btn-secondary">Cancel</button>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink,
    NgForOf
  ],
  styles: [`
    .task-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .error-message {
      color: red;
      font-size: 0.8rem;
      margin-top: 5px;
    }

    .form-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .alert {
      padding: 10px;
      margin-top: 20px;
      border-radius: 4px;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .user-assignment-container {
      margin-top: 10px;
    }

    .user-avatars {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #6c757d;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-avatar:hover {
      transform: scale(1.1);
    }

    .user-avatar.selected {
      background-color: #007bff;
      transform: scale(1.1);
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  users: User[] = [];
  isEditMode = false;
  taskId: string = '';
  loading = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['todo'],
      assigned_to: ['', Validators.required],
      created_by: this.fb.group({
        username: ['']
      })
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.taskId = id;
      this.loadTask(id);
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        if (users.length > 0 && !this.isEditMode) {
          this.taskForm.patchValue({ assigned_to: users[0].id });
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users.';
      }
    });
  }

  loadTask(id: string): void {
    this.loading = true;
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          assigned_to: task.assigned_to,
          created_by: {
            username: task.created_by.username
          }
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.error = 'Failed to load task details.';
        this.loading = false;
      }
    });
  }

  assignToUser(userId: any): void {
    this.taskForm.patchValue({ assigned_to: userId });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.loading = true;

    // Get the current user's username from localStorage or a service
    // This is a placeholder - implement according to your auth solution
    const currentUsername = 'current_user'; // Replace with actual implementation

    const taskData: Task = {
      ...this.taskForm.value,
      created_by: {
        username: currentUsername
      }
    };

    if (this.isEditMode) {
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.error = 'Failed to update task.';
          this.loading = false;
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.error = 'Failed to create task.';
          this.loading = false;
        }
      });
    }
  }
}
