
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Participant } from '../participant';

interface ParticipantsResponse {
  status: string;
  success: string;
  institutions: Participant[];
}

interface InstitutionResponse {
  status: string;
  message: string;
  success: string;
  institution?: Participant;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private readonly apiUrl =
    'http://localhost:9081/acs-dev/api/institutions';

  constructor(private http: HttpClient) {}

 getAll(): Observable<Participant[]> {
  return this.http
    .get<ParticipantsResponse>(this.apiUrl)
    .pipe(map(response => response.institutions));
}

  findById(id: number): Observable<Participant> {
    return this.getAll().pipe(
      map(participants => {
        const participant = participants.find(item => item.id === id);

        if (!participant) {
          throw new Error(`Participant with ID ${id} was not found.`);
        }

        return participant;
      })
    );
  }

  add(
    participant: Omit<Participant, 'id'>
  ): Observable<InstitutionResponse> {
    return this.http.post<InstitutionResponse>(
      this.apiUrl,
      participant
    );
  }

  update(
    id: number,
    participant: Omit<Participant, 'id'>
  ): Observable<InstitutionResponse> {
    return this.http.put<InstitutionResponse>(
      `${this.apiUrl}/${id}`,
      participant
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
