import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import {DatePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  imports: [
    TitleCasePipe,
    DatePipe
  ],
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() viewMode: 'list' | 'board' = 'list';
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{task: Task, newStatus: string}>();

  isExpanded = false;

  getStatusColor(status: string): string {
    const colors = {
      'todo': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'done': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  handleEdit(): void {
    this.edit.emit(this.task);
  }

  handleDelete(): void {
    if (this.task.id) {
      this.delete.emit(this.task.id.toString());
    }
  }

  handleStatusChange(newStatus: string): void {
    this.statusChange.emit({ task: this.task, newStatus });
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
