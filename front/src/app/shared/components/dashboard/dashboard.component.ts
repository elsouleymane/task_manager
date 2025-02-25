import { Component, OnInit } from '@angular/core';
                  import { Router } from '@angular/router';
                  import { User } from '../../../core/models/user.model';
                  import { Task } from '../../../core/models/task.model';
                  import { TaskService } from '../../../core/services/task.service';
                  import { UserService } from '../../../core/services/user.service';
                  import { AuthService } from '../../../core/services/auth.service';
                  import { TaskListComponent } from '../task-list/task-list.component';
                  import { NgForOf } from '@angular/common';

                  @Component({
                    selector: 'app-dashboard',
                    template: `
                      <div class="dashboard-container">
                        <header class="dashboard-header">
                          <h1>Task Manager Dashboard</h1>
                          <div class="user-info">
                            <span>Welcome!</span>
                            <button class="btn btn-logout" (click)="logout()">Logout</button>
                          </div>
                        </header>

                        <div class="dashboard-stats">
                          <div class="stat-card">
                            <h3>Total Tasks</h3>
                            <p class="stat-value">{{ tasks.length }}</p>
                          </div>
                          <div class="stat-card">
                            <h3>To Do</h3>
                            <p class="stat-value">{{ getTaskCountByStatus('todo') }}</p>
                          </div>
                          <div class="stat-card">
                            <h3>In Progress</h3>
                            <p class="stat-value">{{ getTaskCountByStatus('in-progress') }}</p>
                          </div>
                          <div class="stat-card">
                            <h3>Completed</h3>
                            <p class="stat-value">{{ getTaskCountByStatus('done') }}</p>
                          </div>
                        </div>

                        <div class="task-visualization">
                          <h2>Task Assignment Visualization</h2>
                          <div class="user-task-grid">
                            <div *ngFor="let user of users" class="user-task-card">
                              <div class="user-info">
                                <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
                                <h3>{{ user.username }}</h3>
                              </div>
                              <div class="task-count">
                                <p>{{ user && user.id ? getTaskCountByUser(+user.id) : 0 }} tasks assigned</p>
                              </div>
                              <div class="task-status-bars">
                                <div class="status-bar">
                                  <div class="status-label">To Do</div>
                                  <div class="progress-bar">
                                    <div class="progress"
                                         [style.width.%]="user && user.id ? getTaskPercentageByUserAndStatus(+user.id, 'todo') : 0"
                                         style="background-color: #ffc107;"></div>
                                  </div>
                                  <div class="status-count">{{ user && user.id ? getTaskCountByUserAndStatus(+user.id, 'todo') : 0 }}</div>
                                </div>
                                <div class="status-bar">
                                  <div class="status-label">In Progress</div>
                                  <div class="progress-bar">
                                    <div class="progress"
                                         [style.width.%]="user && user.id ? getTaskPercentageByUserAndStatus(+user.id, 'in-progress') : 0"
                                         style="background-color: #17a2b8;"></div>
                                  </div>
                                  <div class="status-count">{{ user && user.id ? getTaskCountByUserAndStatus(+user.id, 'in-progress') : 0 }}</div>
                                </div>
                                <div class="status-bar">
                                  <div class="status-label">Done</div>
                                  <div class="progress-bar">
                                    <div class="progress"
                                         [style.width.%]="user && user.id ? getTaskPercentageByUserAndStatus(+user.id, 'done') : 0"
                                         style="background-color: #28a745;"></div>
                                  </div>
                                  <div class="status-count">{{ user && user.id ? getTaskCountByUserAndStatus(+user.id, 'done') : 0 }}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <app-task-list></app-task-list>
                      </div>
                    `,
                    imports: [
                      TaskListComponent,
                      NgForOf
                    ],
                    styles: [`
                      .dashboard-container {
                        padding: 20px;
                      }

                      .dashboard-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #eee;
                      }

                      .user-info {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                      }

                      .btn-logout {
                        padding: 6px 12px;
                        background-color: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                      }

                      .dashboard-stats {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                      }

                      .stat-card {
                        background-color: white;
                        border-radius: 5px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        text-align: center;
                      }

                      .stat-value {
                        font-size: 2rem;
                        font-weight: bold;
                        margin: 10px 0 0;
                      }

                      .task-visualization {
                        margin-bottom: 30px;
                      }

                      .user-task-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 20px;
                      }

                      .user-task-card {
                        background-color: white;
                        border-radius: 5px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                      }

                      .user-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 15px;
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
                      }

                      .task-count {
                        margin-bottom: 10px;
                        color: #666;
                      }

                      .task-status-bars {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                      }

                      .status-bar {
                        display: grid;
                        grid-template-columns: 100px 1fr 40px;
                        align-items: center;
                        gap: 10px;
                      }

                      .status-label {
                        font-size: 0.9rem;
                        color: #666;
                      }

                      .progress-bar {
                        height: 10px;
                        background-color: #f0f0f0;
                        border-radius: 5px;
                        overflow: hidden;
                      }

                      .progress {
                        height: 100%;
                        border-radius: 5px;
                      }

                      .status-count {
                        font-size: 0.9rem;
                        color: #666;
                        text-align: right;
                      }
                    `]
                  })
                  export class DashboardComponent implements OnInit {
                    tasks: Task[] = [];
                    users: User[] = [];

                    constructor(
                      private taskService: TaskService,
                      private userService: UserService,
                      private authService: AuthService,
                      private router: Router
                    ) {}

                    ngOnInit(): void {
                      this.loadTasks();
                      this.loadUsers();
                    }

                    loadTasks(): void {
                      this.taskService.getTasks().subscribe({
                        next: (tasks) => {
                          this.tasks = tasks;
                        },
                        error: (error) => {
                          console.error('Error loading tasks:', error);
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

                    getTaskCountByStatus(status: string): number {
                      return this.tasks.filter(task => task.status === status).length;
                    }

                    getTaskCountByUser(userId?: number): number {
                      if (!userId) return 0;
                      return this.tasks.filter(task => task.assigned_to === userId).length;
                    }

                    getTaskCountByUserAndStatus(userId?: number, status?: string): number {
                      if (!userId || !status) return 0;
                      return this.tasks.filter(task => task.assigned_to === userId && task.status === status).length;
                    }

                    getTaskPercentageByUserAndStatus(userId?: number, status?: string): number {
                      const userTaskCount = this.getTaskCountByUser(userId);
                      if (userTaskCount === 0) return 0;

                      const statusCount = this.getTaskCountByUserAndStatus(userId, status);
                      return (statusCount / userTaskCount) * 100;
                    }

                    logout(): void {
                      this.authService.logout();
                      this.router.navigate(['/login']);
                    }
                  }
