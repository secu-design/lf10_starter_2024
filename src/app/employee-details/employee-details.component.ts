import {Component, Input} from '@angular/core';
import {Employee} from "../Employee";
import {NgForOf} from "@angular/common";
import {EmployeeDetailService} from "../service/EmployeeDetailService.service";
import {MatDialog} from "@angular/material/dialog";
import {EditComponent} from "../popUps/edit/edit.component";

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
    private employeeDetailService: EmployeeDetailService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.employeeDetailService.selectedEmployee$.subscribe((employee) => {
      this.employee = employee;
    });
  }

  edit() {
    this.dialog.open(EditComponent, {
      width: '1200px',
      height: '600px',
      panelClass: 'custom-dialog-container'
    });
  }
}

