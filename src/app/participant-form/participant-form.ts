import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../services/participant';

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participant-form.html',
  styleUrl: './participant-form.css'
})
export class ParticipantForm {
  id: number | null = null;
  isEditMode = false;

  name = '';
  bic = '';
  shortName = '';
  email = '';
  phoneNumber = '';
  status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

  constructor(
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      this.isEditMode = true;
      this.id = Number(idParam);

      const participant = this.participantService.findById(this.id);

      if (!Number.isInteger(this.id) || this.id <= 0 || !participant) {
        alert('Participant not found.');
        this.router.navigate(['/participants']);
        return;
      }

      this.name = participant.name;
      this.bic = participant.bic;
      this.shortName = participant.shortName;
      this.email = participant.email;
      this.phoneNumber = participant.phoneNumber;
      this.status = participant.status;
    }
  }

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

    const participantData = {
      name: this.name.trim(),
      bic: this.bic.trim().toUpperCase(),
      shortName: this.shortName.trim(),
      email: this.email.trim(),
      phoneNumber: this.phoneNumber.trim(),
      status: this.status
    };

    if (this.isEditMode && this.id !== null) {
      const updated = this.participantService.update(
        this.id,
        participantData
      );

      if (!updated) {
        alert('Participant not found. No changes were saved.');
        this.router.navigate(['/participants']);
        return;
      }
    } else {
      this.participantService.add(participantData);
    }

    this.router.navigate(['/participants']);
  }

  cancel(): void {
    this.router.navigate(['/participants']);
  }
}
