import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';

  message = '';
  messageType: 'success' | 'error' = 'error';

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
      this.message = 'Login successful!';
      this.messageType = 'success';
    } else {
      this.message = 'Invalid username or password.';
      this.messageType = 'error';
    }
  }
}
