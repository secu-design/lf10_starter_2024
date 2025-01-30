import {Component, Inject, Input} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Employee} from "../../Employee";
import {EmployeeDetailService} from "../../service/EmployeeDetailService.service";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {QualificationService} from "../../service/qualification.service";
import {Qualification} from "../../Qualification";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {EmployeeService} from "../../service/employee.service";
import {closeBusyDialog, openBusyDialog, openMessageDialog, openToast} from '../../utils/GlobalFunctions';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    NgForOf,
    FormsModule,
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})

export class EditComponent {

  @Input() employee: Employee = new Employee();
  qualifications$: Observable<Qualification[]>;
  isEdit: boolean;
  private searchTerm$ = new BehaviorSubject<string>('');
  filteredQualifications$: Observable<Qualification[]>;

  constructor(
    private employeeDetailService: EmployeeDetailService,
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    public dialogRef: MatDialogRef<EditComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    let receivedEmployee  = this.isEdit && this.employeeDetailService.getSelectedEmployee() != null ? <Employee>this.employeeDetailService.getSelectedEmployee() : new Employee();

    this.employee = this.isEdit ? Object.assign({}, receivedEmployee) : new Employee();
    this.qualifications$ = this.qualificationService.getQualifications();

    this.filteredQualifications$ = combineLatest([this.qualifications$, this.searchTerm$]).pipe(
      map(([qualifications, searchTerm]) => {
        const filters = searchTerm.toLowerCase().split(',').map(f => f.trim());
        return qualifications.filter(qualification =>
          filters.every(filter =>
            `${qualification.id} ${qualification.skill}`.toLowerCase().includes(filter)));
      })
    );
  }

  onCreate(): void {
    openBusyDialog(this.dialog, "Mitarbeiter wird angelegt");
    this.employeeService.post(this.employee, (employee) => { //on success
      closeBusyDialog();
      //openMessageDialog(this.dialog, `Mitarbeiter '${this.employee.firstName} ${this.employee.lastName}' erfolgreich angelegt!`);
      openToast(this.snackBar, `Mitarbeiter '${this.employee.firstName} ${this.employee.lastName}' angelegt`, false);
      this.employeeDetailService.setSelectedEmployee(employee);
      this.employeeService.loadData();
    }, (error) => { //on error
      closeBusyDialog();
      openMessageDialog(this.dialog, error);
      //openToast(this.snackBar, `Mitarbeiter '${this.employee.firstName} ${this.employee.lastName}' konnte nicht angelegt werden`, true);
    });
    this.dialogRef.close();
  }

  onSave(): void {
    openBusyDialog(this.dialog, "Mitarbeiter wird gespeichert");
    this.employeeService.put(this.employee.id, this.employee, () => { //on success
      closeBusyDialog();
      //openMessageDialog(this.dialog, `Mitarbeiter '${this.employee.firstName} ${this.employee.lastName}' erfolgreich geändert!`);
      openToast(this.snackBar, `Mitarbeiter '${this.employee.firstName} ${this.employee.lastName}' geändert`, false);
      this.employeeService.loadData((list) => {
        const selectedEmployee = list.find((e) => this.employee.id === e.id);
        console.log(selectedEmployee);
        this.employeeDetailService.setSelectedEmployee(selectedEmployee || new Employee());
      });
    }, (error) => { //on error
      closeBusyDialog();
      openMessageDialog(this.dialog, error);
      //openToast(this.snackBar, `Mitarbeiter '${this.employee.firstName} ${this.employee.lastName}' konnte nicht geändert werden`, true);
    });
    this.dialogRef.close();
  }

  validatePlz(){
    setTimeout(() => {
      let text = "";
      if (this.employee != null && this.employee.postcode != null) text = this.employee?.postcode?.replace(/\D/g, '');
      this.employee.postcode = text;
    }, 0);
  }

  compareQualifications(qual1: Qualification, qual2: Qualification): boolean {
    return qual1 && qual2 ? qual1.skill === qual2.skill : false;
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm$.next(input.value);
  }
}
