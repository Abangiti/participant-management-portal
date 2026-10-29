import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Participants } from './participants/participants';
import { ParticipantForm } from './participant-form/participant-form';
import { authGuard } from './core/auth/auth-guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'participants',
    component: Participants,
    canActivate: [authGuard]
  },
  {
    path: 'participants/new',
    component: ParticipantForm,
    canActivate: [authGuard]
  },
  {
    path: 'participants/edit/:id',
    component: ParticipantForm,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];

