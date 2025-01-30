import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {Employee} from "../Employee";
import {FormsModule} from "@angular/forms";
import {EmployeeService} from "../service/employee.service";
import {EditComponent} from "../popUps/edit/edit.component";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeDetailService} from "../service/EmployeeDetailService.service";
import {closeBusyDialog, openBusyDialog, openMessageDialog, openToast} from "../utils/GlobalFunctions";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons/faEdit";
import {faAdd} from "@fortawesome/free-solid-svg-icons/faAdd";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;
  activeEmployee: Employee | null = null;

  // Filter
  filteredEmployees$: Observable<Employee[]>; // Filtered employee list
  private searchTerm$ = new BehaviorSubject<string>(''); // Search term observable

  // Icons
  protected readonly faEdit = faEdit;
  protected readonly faAdd = faAdd;
  protected readonly faTrash = faTrash;

  constructor(
    private employeeService: EmployeeService,
    private employeeDetailService: EmployeeDetailService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar)
  {
    this.employees$ = this.employeeService.getEmployees();
    this.filteredEmployees$ = combineLatest([this.employees$, this.searchTerm$]).pipe(
      map(([employees, searchTerm]) => {
        const filters = searchTerm.toLowerCase().split(',').map(f => f.trim());
        return employees.filter(employee =>
          filters.every(filter =>
            `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(filter) ||
            employee.skillSet?.some(q => q.skill.toLowerCase().includes(filter))
          )
        );
      })
    );
  }

  ngOnInit(): void {
    this.employeeService.loadData();
    this.employeeDetailService.getSelectedEmployeeObservable().subscribe((employee) => {
      let button = document.getElementById('edit-button') as HTMLButtonElement;
      button.disabled = false;
      this.activeEmployee = employee;
    });
  }

  setActiveEmployee(employee: Employee) {
    this.employeeDetailService.setSelectedEmployee(employee);
  }

  addEmployee() {
    this.dialog.open(EditComponent, {
      width: '1000px',
      height: '500px',
      panelClass: 'custom-dialog-container',
      data: {isEdit: false}
    });
  }

  editEmployee() {
    this.dialog.open(EditComponent, {
      width: '1000px',
      height: '500px',
      panelClass: 'custom-dialog-container',
      data: {isEdit: true}
    });
  }

  removeEmployee() {
    if (this.activeEmployee && this.activeEmployee.id !== undefined) {
      let name = this.activeEmployee.firstName + ' ' + this.activeEmployee.lastName;
      openBusyDialog(this.dialog, "Mitarbeiter wird gelöscht");
      this.employeeService.delete(this.activeEmployee.id, () => { //on success
        closeBusyDialog();
        openToast(this.snackBar, `Mitarbeiter '${name}' gelöscht`, false);
        this.employeeService.loadData();
      }, (error) => { //on error
        closeBusyDialog();
        openMessageDialog(this.dialog, error);
      });
    }
    this.employeeDetailService.setSelectedEmployee(new Employee());
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm$.next(input.value);
  }
}
