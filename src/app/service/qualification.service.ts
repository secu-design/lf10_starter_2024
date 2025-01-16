import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Qualification} from '../Qualification';
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private qualificationsSubject: BehaviorSubject<Qualification[]> = new BehaviorSubject<Qualification[]>([]);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService) {
  }

  //refresh the qualification list
  loadData(
    onSuccess?: (qualifications: Qualification[]) => void,
    onError?: (error: any) => void) {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      this.http.get<Qualification[]>('http://localhost:8089/qualifications', {headers}).subscribe(
        (qualifications) => {
          this.qualificationsSubject.next(qualifications);
          if (onSuccess) onSuccess(qualifications);
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    });
  }

  // HTTP call to create qualifications
  public post(skill: string, onSuccess?: (qualification: Qualification) => void, onError?: (error: any) => void): Qualification | null {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      const body = {
        skill: skill,
      };

      this.http.post<Qualification>('http://localhost:8089/qualifications', body, {headers}).subscribe(
        (qualification) => {
          if (onSuccess) onSuccess(qualification);
          return qualification;
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    });
    return null;
  }


  // HTTP call to update qualifications
  public put(employeeId: number, skill: string, onSuccess?: (qualification: Qualification) => void, onError?: (error: any) => void): Qualification | null {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      const body = {
        skill: skill,
      };

      this.http.put<Qualification>(`http://localhost:8089/qualifications/${employeeId}`, body, {headers}).subscribe(
        (qualification) => {
          if (onSuccess) onSuccess(qualification);
          return qualification;
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    });
    return null;
  }

// HTTP call to delete a qualification
  public delete(skillId: number, onSuccess?: () => void, onError?: (error: any) => void): void {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.delete<void>(`http://localhost:8089/qualifications/${skillId}`, {headers})
        .subscribe(
          () => {
            if (onSuccess) onSuccess();
          },
          (error) => {
            if (onError) onError(error);
          }
        );
    });
  }

  // Get the observable that components can subscribe to
  getQualifications(): Observable<Qualification[]> {
    return this.qualificationsSubject.asObservable();
  }
}
