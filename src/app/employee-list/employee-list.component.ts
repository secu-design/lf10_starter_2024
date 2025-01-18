import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
import {Employee} from "../Employee";
import {EmployeeService} from "../service/employee.service";
import {EmployeeDetailService} from "../service/EmployeeDetailService.service";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent
{
  employees$: Observable<Employee[]>;

  constructor(
    private employeeService: EmployeeService,
    private employeeDetailService: EmployeeDetailService) {
    this.employees$ = this.employeeService.getEmployees(); // Use the service to get employees
  }

  onRowClick(employee: any) {
    this.employeeDetailService.setSelectedEmployee(employee);
  }

  trackById(item: any): number {
    return item.id;
  }

  ngOnInit(): void {
    this.employeeService.loadData(); // Load the data when the component initializes
  }
}
