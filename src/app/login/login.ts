
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  login(): void {
    if (!this.username.trim() || !this.password) {
      this.message = 'Please enter both username and password.';
      this.messageType = 'error';
      return;
    }

    if (
      this.username === 'admin' &&
      this.password === 'Admin@123'
    ) {
      this.router.navigate(['/participants']);
    } else {
      this.message = 'Invalid username or password.';
      this.messageType = 'error';
    }
  }
}
