
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Participants } from './participants/participants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'participants',
    component: Participants
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
