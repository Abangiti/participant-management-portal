
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Participant } from '../participant';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participants.html',
  styleUrl: './participants.css'
})
export class Participants {
  searchTerm = '';

  participants: Participant[] = [
    {
      id: 1,
      name: 'Horizon Bank',
      bic: 'HORZETAA',
      shortName: 'Horizon',
      email: 'contact@horizon.example',
      phoneNumber: '+251 911 000 001',
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Unity Bank',
      bic: 'UNTYETAA',
      shortName: 'Unity',
      email: 'contact@unity.example',
      phoneNumber: '+251 911 000 002',
      status: 'ACTIVE'
    },
    {
      id: 3,
      name: 'Blue Nile Bank',
      bic: 'BNILETAA',
      shortName: 'Blue Nile',
      email: 'contact@bluenile.example',
      phoneNumber: '+251 911 000 003',
      status: 'ACTIVE'
    },
    {
      id: 4,
      name: 'Summit Bank',
      bic: 'SUMMETAA',
      shortName: 'Summit',
      email: 'contact@summit.example',
      phoneNumber: '+251 911 000 004',
      status: 'INACTIVE'
    },
    {
      id: 5,
      name: 'Valley Bank',
      bic: 'VALLETAA',
      shortName: 'Valley',
      email: 'contact@valley.example',
      phoneNumber: '+251 911 000 005',
      status: 'INACTIVE'
    }
  ];

  constructor(private router: Router) {}

  get filteredParticipants(): Participant[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.participants.filter(participant =>
      participant.name.toLowerCase().includes(search) ||
      participant.bic.toLowerCase().includes(search)
    );
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
