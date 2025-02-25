import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" formControlName="username" class="form-control">
          <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="error-message">
            Username is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" formControlName="password" class="form-control">
          <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
            Password is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary">Login</button>
          <p>Don't have an account? <a routerLink="/register">Register</a></p>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  styles: [`
    .login-container {
      max-width: 400px;
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
    }

    .btn {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn:disabled {
      background-color: #cccccc;
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
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = 'Failed to login. Please check your credentials.';
          console.error('Login error:', err);
        }
      });
    }
  }
}
