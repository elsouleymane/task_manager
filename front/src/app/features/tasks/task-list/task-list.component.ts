import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <button
            [class.bg-blue-500]="viewMode === 'list'"
            [class.bg-gray-300]="viewMode !== 'list'"
            class="px-4 py-2 rounded-lg text-white"
            (click)="viewMode = 'list'">
            Liste
          </button>
          <button
            [class.bg-blue-500]="viewMode === 'board'"
            [class.bg-gray-300]="viewMode !== 'board'"
            class="px-4 py-2 rounded-lg text-white"
            (click)="viewMode = 'board'">
            Kanban
          </button>
        </div>
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg"
          (click)="openNewTaskForm()">
          Nouvelle Tâche
        </button>
      </div>

      <!-- Vue Liste -->
      <div *ngIf="viewMode === 'list'" class="grid gap-4">
        <div *ngFor="let task of tasks"
          class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-semibold">{{task.title}}</h3>
              <p class="text-gray-600">{{task.description}}</p>
            </div>
            <span
              class="px-2 py-1 rounded-full text-sm"
              [class.bg-yellow-200]="task.status === 'todo'"
              [class.bg-blue-200]="task.status === 'in_progress'"
              [class.bg-green-200]="task.status === 'done'">
              {{task.status}}
            </span>
          </div>
          <div class="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Assigné à: {{task.assigned_to}}</span>
            <div class="flex space-x-2">
              <button
                class="text-blue-500 hover:text-blue-700"
                (click)="editTask(task)">
                Modifier
              </button>
              <button
                class="text-red-500 hover:text-red-700"
                (click)="deleteTask(task.task_id)">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue Kanban -->
      <div *ngIf="viewMode === 'board'" class="grid grid-cols-3 gap-4">
        <div *ngFor="let status of ['todo', 'in_progress', 'done']"
          class="bg-gray-100 p-4 rounded-lg">
          <h2 class="text-lg font-semibold mb-4 capitalize">{{status.replace('_', ' ')}}</h2>
          <div class="space-y-4">
            <div *ngFor="let task of getTasksByStatus(status)"
              class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-move">
              <h3 class="text-lg font-semibold">{{task.title}}</h3>
              <p class="text-gray-600 text-sm">{{task.description}}</p>
              <div class="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>Assigné à: {{task.assigned_to}}</span>
                <div class="flex space-x-2">
                  <button
                    class="text-blue-500 hover:text-blue-700"
                    (click)="editTask(task)">
                    Modifier
                  </button>
                  <button
                    class="text-red-500 hover:text-red-700"
                    (click)="deleteTask(task.task_id)">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  viewMode: 'list' | 'board' = 'list';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      tasks => this.tasks = tasks
    );
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  editTask(task: Task) {
    // Implement edit logic
  }

  deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    this.taskService.deleteTask(taskId).subscribe(
      () => this.loadTasks()
    );
  }

  openNewTaskForm() {
    // Implement new task form logic
  }
}
