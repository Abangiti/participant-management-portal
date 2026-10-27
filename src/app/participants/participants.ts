
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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
export class Participants implements OnInit {
  searchTerm = '';
  participants: Participant[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private participantService: ParticipantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadParticipants();
  }



loadParticipants(): void {
  console.log('Loading participants from API...');

  this.loading = true;
  this.errorMessage = '';

  this.participantService.getAll().subscribe({
    next: (participants) => {
      console.log('Participants received from API:', participants);

      this.participants = participants;
      this.loading = false;

      this.cdr.detectChanges();

      console.log('Loading state after response:', this.loading);
    },
    error: (error) => {
      console.error('Failed to load participants:', error);

      this.errorMessage =
        'Unable to load participant banks. Please try again.';

      this.loading = false;

      console.log('Loading state after error:', this.loading);
    }
  });
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

  editParticipant(id: number): void {
    this.router.navigate(['/participants/edit', id]);
  }

  deleteParticipant(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this participant bank?'
    );

    if (!confirmed) {
      return;
    }

    this.participantService.delete(id).subscribe({
      next: () => {
        console.log('Participant deleted successfully:', id);
        this.loadParticipants();
      },
      error: (error) => {
        console.error('Failed to delete participant:', error);

        this.errorMessage =
          'Failed to delete participant. Please try again.';
      }
    });
  }
}
