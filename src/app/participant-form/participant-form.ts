
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParticipantService } from '../services/participant';
import { LoadingSpinner } from '../shared/loading-spinner/loading-spinner';



@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinner],
  templateUrl: './participant-form.html',
  styleUrl: './participant-form.css'
})
export class ParticipantForm {
  id: number | null = null;
  isEditMode = false;
  form: FormGroup;
  isSaving = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      bic: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9]{8,11}$/)
        ]
      ],
      shortName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      const parsedId = Number(idParam);

      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        this.errorMessage = 'Invalid participant ID.';
        return;
      }

      this.id = parsedId;
      this.isEditMode = true;
      this.loadParticipant(parsedId);
    }
  }

  private loadParticipant(id: number): void {
    this.participantService.findById(id).subscribe({
      next: (participant) => {
        this.form.patchValue({
          name: participant.name,
          bic: participant.bic,
          shortName: participant.shortName,
          address: participant.address,
          email: participant.email,
          phoneNumber: participant.phoneNumber,
          status: participant.status
        });
      },
      error: (error) => {
        console.error('Failed to load participant:', error);
        this.errorMessage =
          'Participant not found or could not be loaded.';
      }
    });
  }


save(): void {
  if (this.form.invalid || this.isSaving) {
    this.form.markAllAsTouched();
    return;
  }

  const formValue = this.form.getRawValue();

  const participantData = {
    name: formValue.name.trim(),
    bic: formValue.bic.trim().toUpperCase(),
    shortName: formValue.shortName.trim(),
    address: formValue.address.trim(),
    email: formValue.email.trim(),
    phoneNumber: formValue.phoneNumber.trim(),
    status: formValue.status as 'ACTIVE' | 'INACTIVE'
  };

  this.isSaving = true;
  this.errorMessage = '';

  const request =
    this.isEditMode && this.id !== null
      ? this.participantService.update(this.id, participantData)
      : this.participantService.add(participantData);

  request.subscribe({
    next: (response) => {
      console.log(
        this.isEditMode
          ? 'Participant updated successfully:'
          : 'Participant created successfully:',
        response
      );

      const message = this.isEditMode
        ? 'Bank updated successfully!'
        : 'Bank created successfully!';

      this.router.navigate(['/participants'], {
        state: { notificationMessage: message }
      });
    },
    error: (error) => {
      console.error('Failed to save participant:', error);

      this.errorMessage = this.isEditMode
        ? 'Failed to update participant. Please try again.'
        : 'Failed to create participant. Please try again.';

      this.isSaving = false;
    }
  });
}


  cancel(): void {
    this.router.navigate(['/participants']);
  }
}
