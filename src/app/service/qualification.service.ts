import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Qualification} from '../Qualification';
import {TokenService} from "./token.service";
import {Employee} from "../Employee";

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private qualificationsSubject: BehaviorSubject<Qualification[]> = new BehaviorSubject<Qualification[]>([]);

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  //refresh the qualification list
   loadData(onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void) {
    this.tokenService.getToken().then((token: string) => {
      this.fetchQualifications(token);
    }).catch((error) => {
      console.error('Failed to get token', error);
    });
  }

  // HTTP call to fetch qualifications
  private fetchQualifications(token: string): void {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    this.http.get<Qualification[]>('http://localhost:8089/qualifications', {headers}).subscribe(
      (qualification) => {
        this.qualificationsSubject.next(qualification);
      },
      (error) => {
        console.error('Failed to fetch qualifications', error);
      }
    );
  }


  // HTTP call to create qualifications
  public post(skill: string, onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void): Qualification | null {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      // Add the skill parameter to the request body
      const body = {
        skill: skill,
      };

      this.http.post<Qualification>('http://localhost:8089/qualifications', body, {headers}).subscribe(
        (qualification) => {
          return qualification;
        },
        (error) => {
          console.error('Failed to create qualifications', error);
        }
      );
    });
    return null;
  }


// HTTP call to delete a qualification
  public delete(skillId: number, onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void): void {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.delete<void>(`http://localhost:8089/qualifications/${skillId}`, {headers})
        .subscribe(
          () => {
            console.log(`Qualification with ID ${skillId} deleted successfully.`);
          },
          (error) => {
            console.error(`Failed to delete qualification with ID ${skillId}`, error);
          }
        );
    });
  }


  // Get the observable that components can subscribe to
  getQualifications(): Observable<Qualification[]> {
    return this.qualificationsSubject.asObservable();
  }

}
