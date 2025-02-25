import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {NgClass} from '@angular/common';
import {User} from '../../../core/models/user.model';
import {UserService} from '../../../core/services/user.service';


@Component({
  selector: 'app-user-assignment',
  template: `
    <div class="user-assignment">
      <h3>Assign To:</h3>
      <div class="user-grid">
        <div *ngFor="let user of users"
             [ngClass]="{'user-card': true, 'selected': selectedUserId === user.id}"
             (click)="selectUser(user.id)">
          <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
          <div class="user-name">{{ user.username }}</div>
        </div>
      </div>
    </div>
  `,
  imports: [
    NgClass
  ],
  styles: [`
    .user-assignment {
      margin: 20px 0;
    }

    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 15px;
      margin-top: 10px;
    }

    .user-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border-radius: 5px;
      background-color: #f8f9fa;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .user-card.selected {
      background-color: #e7f5ff;
      border: 2px solid #007bff;
    }

    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #6c757d;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
      margin-bottom: 10px;
    }

    .user-name {
      text-align: center;
      font-size: 0.9rem;
    }
  `]
})
export class UserAssignmentComponent implements OnInit {
  @Input() selectedUserId?: number;
  @Output() userSelected = new EventEmitter<number>();

  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
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

  selectUser(userId: number): void {
    this.selectedUserId = userId;
    this.userSelected.emit(userId);
  }
}

