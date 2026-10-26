import { Injectable } from '@angular/core';
import { Participant } from '../participant';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private participants: Participant[] = [
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

  getAll(): Participant[] {
    return [...this.participants];
  }

  add(participant: Omit<Participant, 'id'>): void {
    const nextId = this.participants.length > 0
      ? Math.max(...this.participants.map(p => p.id)) + 1
      : 1;

    this.participants.push({
      id: nextId,
      ...participant
    });
  }
}
