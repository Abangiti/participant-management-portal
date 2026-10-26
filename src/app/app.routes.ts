import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Participants } from './participants/participants';
import { ParticipantForm } from './participant-form/participant-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'participants', component: Participants },
  { path: 'participants/new', component: ParticipantForm },
  { path: 'participants/edit/:id', component: ParticipantForm },
  { path: '**', redirectTo: 'login' }
];
