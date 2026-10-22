
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [],
  templateUrl: './participants.html',
  styleUrl: './participants.css'
})
export class Participants {

  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/login']);
  }
}
