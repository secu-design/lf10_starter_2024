import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {Employee} from "../Employee";
import {FormsModule} from "@angular/forms";
import {EmployeeService} from "../service/employee.service";
import {EditComponent} from "../popUps/edit/edit.component";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeDetailService} from "../service/EmployeeDetailService.service";
import {closeBusyDialog, openBusyDialog, openMessageDialog} from "../utils/GlobalFunctions";
import {MatSnackBar} from "@angular/material/snack-bar";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent
{
  employees$: Observable<Employee[]>;
  activeEmployee: Employee | null = null;
  filteredEmployees$: Observable<Employee[]>; // Filtered employee list
  private searchTerm$ = new BehaviorSubject<string>(''); // Search term observable
  //icons
  faSearch = faSearch;

  constructor(
    private employeeService: EmployeeService,
    private employeeDetailService: EmployeeDetailService,
    private dialog: MatDialog) {
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
        openMessageDialog(this.dialog, `Mitarbeiter '${name}' wurde erfolgreich gelöscht!`);
        //openToast(this.snackBar, `Mitarbeiter '${name}' gelöscht`, false);
        this.employeeService.loadData();
      }, (error) => { //on error
        closeBusyDialog();
        openMessageDialog(this.dialog, error);
        //openToast(this.snackBar, `Mitarbeiter '${name}' konnte nicht gelöscht werden`, true);
      });
    }
    this.employeeDetailService.setSelectedEmployee(new Employee());
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm$.next(input.value);
  }

}
