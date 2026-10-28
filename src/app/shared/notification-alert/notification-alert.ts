
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-alert.html',
  styleUrl: './notification-alert.css'
})
export class NotificationAlert {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';
}
