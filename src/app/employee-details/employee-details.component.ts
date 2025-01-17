import {Component, Input} from '@angular/core';
import {QualificationListRowComponent} from "../qualification-list-row/qualification-list-row.component";
import {Employee} from "../Employee";
import {NgForOf} from "@angular/common";
import {EmployeeDetailService} from "../service/EmployeeDetailService.service";


@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    QualificationListRowComponent,
    NgForOf
  ],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {

  constructor(private employeeDetailService: EmployeeDetailService){

  }

  @Input() employee: Employee | null = null;


  ngOnInit(): void {
    this.employeeDetailService.selectedEmployee$.subscribe((employee) => {
      this.employee = employee;
    });
  }

}

