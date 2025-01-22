import {Component, Inject, Input} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe, NgForOf} from "@angular/common";
import {Employee} from "../../Employee";
import {EmployeeDetailService} from "../../service/EmployeeDetailService.service";
import {FormsModule} from "@angular/forms";
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
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})


export class EditComponent {

  @Input() employee: Employee = new Employee();
   qualifications$: Observable<Qualification[]>;

  constructor(
    private employeeDetailService: EmployeeDetailService,
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.qualifications$ = this.qualificationService.getQualifications();
  }

  onSave(): void {

    this.employeeService.put(this.employee.id, this.employee);
    this.dialogRef.close(this.data);
  }

  compareQualifications(qual1: Qualification, qual2: Qualification): boolean {
    return qual1 && qual2 ? qual1.skill === qual2.skill : false;
  }

  ngOnInit(): void {
    this.employeeDetailService.selectedEmployee$.subscribe((employee) => {
      if (employee != null)
        this.employee = employee;
      else
        this.employee = new Employee();
    });
  }
}
