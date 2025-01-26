import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Employee} from '../Employee';
import {TokenService} from "./token.service";
import {EmployeeDetailService} from "./EmployeeDetailService.service";

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesSubject: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private employeeDetailService: EmployeeDetailService) {
  }

  //refresh the employee list
  loadData(onSuccess?: (createdEmployee: Employee[]) => void, onError?: (error: any) => void): void {
    this.tokenService.getToken().then((token) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.get<Employee[]>('http://localhost:8089/employees', {headers}).subscribe(
        (employees) => {
          this.employeesSubject.next(employees);
          if (onSuccess) onSuccess(employees);
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    });
  }

  // HTTP call to create employees
  public post(employee: Employee, onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void): Employee | null {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.post<Employee>('http://localhost:8089/employees', this.mapEmployee(employee), {headers}).subscribe(
        (employee) => {
          if (onSuccess) onSuccess(employee);
          return employee;
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    });
    return null;
  }

  // HTTP call to update employees
  public put(employeeId: number, employee: Employee, onSuccess?: (createdEmployee: Employee) => void, onError?: (error: any) => void): Employee | null {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.put<Employee>(`http://localhost:8089/employees/${employeeId}`, this.mapEmployee(employee), {headers}).subscribe(
        (employee) => {
          if (onSuccess) onSuccess(employee);
          return employee;
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    });
    return null;
  }

// HTTP call to delete an employee
  public delete(employeeId: number, onSuccess?: () => void, onError?: (error: any) => void): void {
    this.tokenService.getToken().then((token: string) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      this.http.delete<void>(`http://localhost:8089/employees/${employeeId}`, {headers})
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

  private mapEmployee(employee: Employee): any {
    const employeeCopy: any = structuredClone(employee);
    employeeCopy.skillSet = employee.skillSet.map(qualification => qualification.id);
    return employeeCopy;
  }


  // Get the observable that components can subscribe to
  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }
}
