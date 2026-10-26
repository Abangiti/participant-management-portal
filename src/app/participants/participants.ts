import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Participant } from '../participant';
import { ParticipantService } from '../services/participant';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participants.html',
  styleUrl: './participants.css'
})
export class Participants {
  searchTerm = '';
  participants: Participant[] = [];

  constructor(
    private router: Router,
    private participantService: ParticipantService
  ) {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.participants = this.participantService.getAll();
  }

  get filteredParticipants(): Participant[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.participants.filter(participant =>
      participant.name.toLowerCase().includes(search) ||
      participant.bic.toLowerCase().includes(search)
    );
  }

  addParticipant(): void {
    this.router.navigate(['/participants/new']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
