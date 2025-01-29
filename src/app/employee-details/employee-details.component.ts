import {Component, Input} from '@angular/core';
import {Employee} from "../Employee";
import {NgForOf} from "@angular/common";
import {EmployeeDetailService} from "../service/EmployeeDetailService.service";

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    NgForOf,
  ],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent
{
  @Input() employee: Employee | null = new Employee();

  constructor(
    private employeeDetailService: EmployeeDetailService) {
  }

  ngOnInit(): void {
    this.employeeDetailService.selectedEmployee$.subscribe((employee) => {
      console.log('Selected employee updated in component:', employee);
      this.employee = employee;
    });
  }
}

