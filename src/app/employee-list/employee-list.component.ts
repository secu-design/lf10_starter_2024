import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Employee} from "../Employee";
import {EmployeeService} from "../employee.service";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  bearer: string = '';
  employees$: Observable<Employee[]>;

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService) {
    this.employees$ = this.employeeService.getEmployees(); // Use the service to get employees
  }

  ngOnInit(): void {
    this.employeeService.loadData(); // Load the data when the component initializes
  }
}
