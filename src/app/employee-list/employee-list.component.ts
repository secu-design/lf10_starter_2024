import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
import {Employee} from "../Employee";
import {FormsModule} from "@angular/forms";
import {EmployeeService} from "../service/employee.service";
import {EditComponent} from "../popUps/edit/edit.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent
{
  employees$: Observable<Employee[]>;
  activeEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog) {
    this.employees$ = this.employeeService.getEmployees(); // Use the service to get employees
  }

  ngOnInit(): void {
    this.employeeService.loadData(); // Load the data when the component initializes
  }

  setActiveEmployee(employee: Employee) {
    this.activeEmployee = employee;
  }

  addEmployee() {
    this.dialog.open(EditComponent, {
      width: '1200px',
      height: '600px',
      panelClass: 'custom-dialog-container'
    });
  }

  removeEmployee() {
    if (this.activeEmployee && this.activeEmployee.id !== undefined) {
      this.employeeService.delete(this.activeEmployee.id, () => {
        this.employeeService.loadData(() => {
          this.activeEmployee = null; // Aktive Qualifikation zurücksetzen
        });
      });
    }
  }
}
