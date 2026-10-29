
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';

  message = '';
  messageType: 'success' | 'error' = 'error';
  isLoading = false;

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  login(): void {
    if (!this.username.trim() || !this.password) {
      this.message = 'Please enter both username and password.';
      this.messageType = 'error';
      return;
    }

    this.message = '';
    this.isLoading = true;

    this.auth.login(this.username.trim(), this.password).subscribe({
      next: (response) => {
        if (!response.access_token) {
  this.message = 'Login succeeded, but no access token was returned.';
  this.messageType = 'error';
  this.isLoading = false;
  return;
}

        this.message = 'Login successful.';
        this.messageType = 'success';
        this.isLoading = false;

        this.router.navigate(['/participants']);
      },
      error: (error) => {
        this.message =
          error.friendlyMessage ||
          'Login failed. Please check your credentials and try again.';
        this.messageType = 'error';
        this.isLoading = false;
      }
    });
  }
}
