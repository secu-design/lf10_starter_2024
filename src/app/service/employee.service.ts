import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Employee } from '../Employee';
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesSubject: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  //refresh the employee list
  loadData(onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void): void {
    this.tokenService.getToken().then((token) => {
      this.fetchEmployees(token);
    }).catch((error) => {
      console.error('Failed to get token', error);
    });
  }

  // HTTP call to fetch employees
  private fetchEmployees(token: string): void {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    this.http.get<Employee[]>('http://localhost:8089/employees', { headers }).subscribe(
      (employees) => {
        this.employeesSubject.next(employees);
      },
      (error) => {
        console.error('Failed to fetch employees', error);
      }
    );
  }

  // HTTP call to create qualifications
  public post(employee: Employee, onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void): Employee | null {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.post<Employee>('http://localhost:8089/employees', employee, {headers}).subscribe(
        (qualification) => {
          return qualification;
        },
        (error) => {
          console.error('Failed to create employee', error);
        }
      );
    });
    return null;
  }


// HTTP call to delete a qualification
  public delete(employeeId: number, onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void): void {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.delete<void>(`http://localhost:8089/employees/${employeeId}`, {headers})
        .subscribe(
          () => {
            console.log(`Employees with ID ${employeeId} deleted successfully.`);
          },
          (error) => {
            console.error(`Failed to delete employee with ID ${employeeId}`, error);
          }
        );
    });
  }


  // Get the observable that components can subscribe to
  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

}
