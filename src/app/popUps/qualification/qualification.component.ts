import {Component, Inject, Input} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Qualification} from "../../Qualification";
import {Employee} from "../../Employee";
import {QualificationService} from "../../service/qualification.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {closeBusyDialog, openBusyDialog, openMessageDialog, openToast} from "../../utils/GlobalFunctions";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-qualification',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    FormsModule
  ],
  templateUrl: './qualification.component.html',
  styleUrl: './qualification.component.css'
})

export class QualificationComponent {

  @Input() qualification: Qualification;
  qualifications: Qualification[];
  employees: Employee[];

  constructor(
    private qualificationService: QualificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<QualificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { qualification: Qualification, qualifications: Qualification[], employees: Employee[] }) {
    this.qualification = Object.assign({}, data.qualification);
    this.employees = data.employees;
    this.qualifications = data.qualifications;
  }



  saveQualification(qualification: Qualification) {
    if (qualification.skill === '') {
      openToast(this.snackBar, `Bitte gib eine Qualifikation an`, true);
      return;
    }
    if (this.qualifications == null || this.qualifications.find((qual) => {
      return qual.skill == qualification.skill;
    })) {
      openToast(this.snackBar, `Die Qualifikation '${qualification.skill}' existiert schon`, true);
      return;
    }
    openBusyDialog(this.dialog, "Qualifikation wird gespeichert");
    this.qualificationService.put(qualification.id,qualification.skill, () => { //on success
      closeBusyDialog();
      this.qualificationService.loadData();
      this.dialogRef.close();
      openToast(this.snackBar, `Qualifikation '${qualification.skill}' gespeichert`, false);
    }, (error) => { //on error
      //openToast(this.snackBar, `Fehler beim Speichern der Qualifikation '${qualification}'`, true);
      closeBusyDialog();
      this.qualificationService.loadData();
      openMessageDialog(this.dialog, error)
    });
  }
}
