import {Component, Inject, Input} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Employee} from "../../Employee";
import {EmployeeDetailService} from "../../service/EmployeeDetailService.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {QualificationService} from "../../service/qualification.service";
import {Qualification} from "../../Qualification";
import {Observable} from "rxjs";
import {EmployeeService} from "../../service/employee.service";

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

  constructor(
    private employeeDetailService: EmployeeDetailService,
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.employee = this.isEdit && this.employeeDetailService.getSelectedEmployee() != null ? <Employee>this.employeeDetailService.getSelectedEmployee() : new Employee();

    this.qualifications$ = this.qualificationService.getQualifications();
  }

  onCreate(): void {
    this.employeeService.post(this.employee, (employee) => {
      this.employeeDetailService.setSelectedEmployee(employee);
      this.employeeService.loadData();
    });
    this.dialogRef.close();
  }

  onSave(): void {
    this.employeeService.put(this.employee.id, this.employee, () => {
      this.employeeService.loadData();
    });
    this.dialogRef.close();
  }

  compareQualifications(qual1: Qualification, qual2: Qualification): boolean {
    return qual1 && qual2 ? qual1.skill === qual2.skill : false;
  }
}
