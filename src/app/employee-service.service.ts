import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Employee } from './Employee';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesSubject: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private bearerToken: string = '';

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  // Fetch and load the data if not already loaded
  loadData(): void {
    this.keycloakService.getToken().then((token) => {
      this.bearerToken = token;
      this.fetchEmployees();
    }).catch((error) => {
      console.error('Failed to get token', error);
    });
  }

  // HTTP call to fetch employees
  private fetchEmployees(): void {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearerToken}`);

    this.http.get<Employee[]>('http://localhost:8089/employees', { headers }).subscribe(
      (employees) => {
        this.employeesSubject.next(employees); // Update the BehaviorSubject
      },
      (error) => {
        console.error('Failed to fetch employees', error);
      }
    );
  }

  // Get the observable that components can subscribe to
  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

}
