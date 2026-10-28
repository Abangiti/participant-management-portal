
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly errorMessageSubject =
    new BehaviorSubject<string>('');

  readonly errorMessage$ =
    this.errorMessageSubject.asObservable();

  showError(message: string): void {
    this.errorMessageSubject.next(message);
  }

  clearError(): void {
    this.errorMessageSubject.next('');
  }
}
