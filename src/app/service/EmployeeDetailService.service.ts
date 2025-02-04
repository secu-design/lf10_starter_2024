import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Employee} from '../Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDetailService
{
  private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();

  setSelectedEmployee(employee: Employee)
  {
    this.selectedEmployeeSubject.next(employee);
  }

  getSelectedEmployee()
  {
    return this.selectedEmployeeSubject.getValue();
  }

  getSelectedEmployeeObservable()
  {
    return this.selectedEmployeeSubject;
  }
}
