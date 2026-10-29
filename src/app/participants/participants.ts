
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Participant } from '../participant';
import { ParticipantService } from '../services/participant';
import { LoadingSpinner } from '../shared/loading-spinner/loading-spinner';
import { NotificationAlert } from '../shared/notification-alert/notification-alert';
import { ConfirmModal } from '../shared/confirm-modal/confirm-modal';
import { NotificationService } from '../core/notification-service';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinner,
    NotificationAlert,
    ConfirmModal
  ],
  templateUrl: './participants.html',
  styleUrl: './participants.css'
})
export class Participants implements OnInit {
  searchTerm = '';
  participants: Participant[] = [];
  loading = false;
  errorMessage = '';

  showConfirmModal = false;
  selectedParticipantId: number | null = null;

  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private router: Router,
    private participantService: ParticipantService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const message = navigation?.extras.state?.['notificationMessage'];

    if (typeof message === 'string') {
      this.notificationMessage = message;
      this.notificationType = 'success';
    }
  }

  ngOnInit(): void {
    // Subscribe to error notifications once.
    this.notificationService.errorMessage$.subscribe((message) => {
      if (message) {
        this.notificationMessage = message;
        this.notificationType = 'error';
        this.cdr.detectChanges();
      }
    });

    // Load participants when the page opens.
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
          error.friendlyMessage ??
          'Failed to load participant banks. Please try again.';

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  get filteredParticipants(): Participant[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.participants.filter((participant) =>
      participant.name.toLowerCase().includes(search) ||
      participant.bic.toLowerCase().includes(search)
    );
  }

  addParticipant(): void {
    this.router.navigate(['/participants/new']);
  }

  logout(): void {
    sessionStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  editParticipant(id: number): void {
    this.router.navigate(['/participants/edit', id]);
  }

  deleteParticipant(id: number): void {
    this.selectedParticipantId = id;
    this.showConfirmModal = true;
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.selectedParticipantId = null;
  }

  confirmDelete(): void {
    if (this.selectedParticipantId === null) {
      return;
    }

    const id = this.selectedParticipantId;

    this.showConfirmModal = false;

    this.participantService.delete(id).subscribe({
      next: () => {
        this.notificationMessage = 'Bank deleted successfully!';
        this.notificationType = 'success';
        this.selectedParticipantId = null;

        this.loadParticipants();
      },

      error: (error) => {
        console.error('Failed to delete bank:', error);

        this.notificationMessage =
          error.friendlyMessage ??
          'Failed to delete bank. Please try again.';

        this.notificationType = 'error';
        this.selectedParticipantId = null;
      }
    });
  }
}
