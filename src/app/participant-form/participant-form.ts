import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParticipantService } from '../services/participant';

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './participant-form.html',
  styleUrl: './participant-form.css'
})
export class ParticipantForm {
  id: number | null = null;
  isEditMode = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      bic: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]{8,11}$/)
      ]],
      shortName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      this.isEditMode = true;
      this.id = Number(idParam);

      const participant = this.participantService.findById(this.id);

      if (
        !Number.isInteger(this.id) ||
        this.id <= 0 ||
        !participant
      ) {
        alert('Participant not found.');
        this.router.navigate(['/participants']);
        return;
      }

      this.form.patchValue({
        name: participant.name,
        bic: participant.bic,
        shortName: participant.shortName,
        email: participant.email,
        phoneNumber: participant.phoneNumber,
        status: participant.status
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const participantData = {
      name: formValue.name.trim(),
      bic: formValue.bic.trim().toUpperCase(),
      shortName: formValue.shortName.trim(),
      email: formValue.email.trim(),
      phoneNumber: formValue.phoneNumber.trim(),
      status: formValue.status as 'ACTIVE' | 'INACTIVE'
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
