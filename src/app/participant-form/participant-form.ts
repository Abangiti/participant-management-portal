import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,

} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ParticipantService } from '../services/participant';
import { LoadingSpinner } from '../shared/loading-spinner/loading-spinner';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LoadingSpinner
  ],
  templateUrl: './participant-form.html',
  styleUrl: './participant-form.css'
})
export class ParticipantForm implements OnDestroy {

  @ViewChild('logoInput')
logoInput!: ElementRef<HTMLInputElement>;

  // Participant information
  id: number | null = null;
  isEditMode = false;

  // Form
  form: FormGroup;

  // Loading and error handling
  isSaving = false;
  errorMessage = '';

  // Logo properties
  selectedLogo: File | null = null;
  logoPreview: string | null = null;
  logoError = '';
  existingLogoUrl: string | null = null;

  // Track the temporary image URL
  private logoObjectUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    // Initialize participant form
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

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phoneNumber: ['', Validators.required],

      status: ['ACTIVE', Validators.required]

    });

    // Check whether this is an edit operation
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

  // Load existing participant information
  private loadParticipant(id: number): void {

    this.participantService.findById(id).subscribe({

      next: (participant) => {

        // Load existing logo
        this.existingLogoUrl = participant.logoPath
          ? `${environment.apiUrl.replace('/api/v1', '')}${participant.logoPath}`
          : null;

        // Populate form fields
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

  // Handle logo selection and generate immediate preview
  onLogoSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    this.logoError = '';

    if (!file) {
      return;
    }

    // Allowed image formats
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml'
    ];

    // Validate image format
    if (!allowedTypes.includes(file.type)) {

      this.logoError =
        'Please select a PNG, JPG, WebP, or SVG image.';

      this.selectedLogo = null;

      this.clearLogoPreview();

      input.value = '';

      return;
    }

    // Maximum image size: 2 MB
    if (file.size > 2 * 1024 * 1024) {

      this.logoError =
        'The logo must not exceed 2 MB.';

      this.selectedLogo = null;

      this.clearLogoPreview();

      input.value = '';

      return;
    }

    // Store selected image
    this.selectedLogo = file;

    // Clear previous preview
    this.clearLogoPreview();

    // Generate temporary preview URL
    this.logoObjectUrl = URL.createObjectURL(file);

    // Display preview immediately
    this.logoPreview = this.logoObjectUrl;

    console.log('Selected logo:', file.name);
    console.log('Logo preview:', this.logoPreview);
  }

  // Remove selected logo
  removeSelectedLogo(): void {

  this.selectedLogo = null;

  this.clearLogoPreview();

  this.logoError = '';

  // Clear the file input
  if (this.logoInput) {
    this.logoInput.nativeElement.value = '';
  }
}

  // Clear temporary preview URL
  private clearLogoPreview(): void {

    if (this.logoObjectUrl) {

      URL.revokeObjectURL(this.logoObjectUrl);

      this.logoObjectUrl = null;
    }

    this.logoPreview = null;
  }

  // Save participant
  save(): void {

    if (this.form.invalid || this.isSaving || this.logoError) {

      this.form.markAllAsTouched();

      return;
    }

    const formValue = this.form.getRawValue();

    // Prepare participant data
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

    // Create or update participant
    const request =
      this.isEditMode && this.id !== null

        ? this.participantService.update(this.id, participantData)

        : this.participantService.add(participantData);

    request.subscribe({

      next: (response) => {

        const bankId = this.isEditMode
          ? this.id
          : response.institution?.id;

        // No new logo selected
        if (!this.selectedLogo) {

          this.finishSave(
            this.isEditMode
              ? 'Bank updated successfully!'
              : 'Bank created successfully!'
          );

          return;
        }

        // Check whether participant ID exists
        if (bankId == null) {

          this.errorMessage =
            'The bank was saved, but its ID was not returned. ' +
            'Please reload the bank before uploading its logo.';

          this.isSaving = false;

          return;
        }

        // Upload selected logo
        this.participantService
          .uploadLogo(bankId, this.selectedLogo)
          .subscribe({

            next: () => {

              this.finishSave(
                this.isEditMode
                  ? 'Bank and logo updated successfully!'
                  : 'Bank and logo created successfully!'
              );

            },

            error: (error) => {

              console.error('Logo upload failed:', error);

              this.errorMessage =
                error.friendlyMessage ??
                'The bank was saved, but its logo upload failed. ' +
                'Please try uploading the logo again.';

              this.isSaving = false;

            }

          });

      },

      error: (error) => {

        console.error('Failed to save participant:', error);

        this.errorMessage =
          error.friendlyMessage ??
          (this.isEditMode
            ? 'Failed to update participant. Please try again.'
            : 'Failed to create participant. Please try again.');

        this.isSaving = false;

      }

    });
  }

  // Navigate after successful save
  private finishSave(message: string): void {

    this.router.navigate(['/participants'], {

      state: {
        notificationMessage: message
      }

    });
  }

  // Cancel form
  cancel(): void {

    this.router.navigate(['/participants']);

  }

  // Clean up temporary image URL
  ngOnDestroy(): void {

    this.clearLogoPreview();

  }

}
