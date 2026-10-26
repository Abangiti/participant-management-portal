import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParticipantService } from '../services/participant';

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participant-form.html',
  styleUrl: './participant-form.css'
})
export class ParticipantForm {
  name = '';
  bic = '';
  shortName = '';
  email = '';
  phoneNumber = '';
  status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

  constructor(
    private participantService: ParticipantService,
    private router: Router
  ) {}

  save(): void {
    if (
      !this.name.trim() ||
      !this.bic.trim() ||
      !this.shortName.trim() ||
      !this.email.trim() ||
      !this.phoneNumber.trim()
    ) {
      alert('Please fill in all fields.');
      return;
    }

    this.participantService.add({
      name: this.name.trim(),
      bic: this.bic.trim().toUpperCase(),
      shortName: this.shortName.trim(),
      email: this.email.trim(),
      phoneNumber: this.phoneNumber.trim(),
      status: this.status
    });

    this.router.navigate(['/participants']);
  }

  cancel(): void {
    this.router.navigate(['/participants']);
  }
}
