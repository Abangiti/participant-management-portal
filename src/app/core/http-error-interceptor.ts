
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { NotificationService } from './notification-service';


export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let friendlyMessage =
        'Something went wrong. Please try again.';

      if (error.status === 0) {
        friendlyMessage =
          'Cannot connect to the server. Check that the backend is running.';
      } else if (error.status === 400) {
        friendlyMessage =
          'Invalid request. Please check the information you entered.';
      } else if (error.status === 401) {
        friendlyMessage =
          'You are not authorized to perform this action.';
      } else if (error.status === 403) {
        friendlyMessage =
          'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        friendlyMessage =
          'The requested resource was not found.';
      } else if (error.status === 413) {
        friendlyMessage =
          'The uploaded file is too large.';
      } else if (error.status >= 500) {
        friendlyMessage =
          'A server error occurred. Please try again later.';
      }

      console.error('HTTP error:', error.status, friendlyMessage);

      notificationService.showError(friendlyMessage);

      return throwError(() => ({
        ...error,
        friendlyMessage
      }));
    })
  );
};
