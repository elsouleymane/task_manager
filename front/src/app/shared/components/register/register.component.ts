import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" formControlName="username" class="form-control">
          <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
               class="error-message">
            Username is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" formControlName="password" class="form-control">
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
               class="error-message">
            Password is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="registerForm.invalid" class="btn btn-primary">Register</button>
          <p>Already have an account? <a routerLink="/login">Login</a></p>
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
    .register-container {
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
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = 'Registration failed. Please try again.';
          console.error('Registration error:', err);
        }
      });
    }
  }
}
