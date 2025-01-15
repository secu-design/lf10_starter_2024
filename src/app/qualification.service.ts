import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Qualification} from './Qualification';
import {KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private qualificationsSubject: BehaviorSubject<Qualification[]> = new BehaviorSubject<Qualification[]>([]);
  private bearerToken: string = '';

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {
  }

  // Fetch and load the data if not already loaded
  loadData(): void {
    this.keycloakService.getToken().then((token) => {
      this.bearerToken = token;
      this.fetchQualifications();
    }).catch((error) => {
      console.error('Failed to get token', error);
    });
  }

  // HTTP call to fetch qualifications
  private fetchQualifications(): void {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearerToken}`);

    this.http.get<Qualification[]>('http://localhost:8089/qualifications', {headers}).subscribe(
      (qualification) => {
        this.qualificationsSubject.next(qualification);
      },
      (error) => {
        console.error('Failed to fetch qualifications', error);
      }
    );
  }

  // Get the observable that components can subscribe to
  getEmployees(): Observable<Qualification[]> {
    return this.qualificationsSubject.asObservable();
  }

}
