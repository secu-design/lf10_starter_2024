import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {QualificationService} from "../service/qualification.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Qualification} from "../Qualification";
import {openMessageDialog, openToast} from "../utils/GlobalFunctions";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-qualifications',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './qualifications.component.html',
  styleUrl: './qualifications.component.css'
})
export class QualificationsComponent {
  qualifications$: Observable<Qualification[]>;
  activeQualification: Qualification | null = null;

  constructor(
    private qualificationService: QualificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
    this.qualifications$ = this.qualificationService.getQualifications();
  }

  ngOnInit(): void {
    this.qualificationService.loadData();
  }

  setActiveQualification(qualification: Qualification) {
    this.activeQualification = qualification;
  }

  //addQualification and removeQualification() only show a message dialog when an error happens, in case you want to add/remove multiple qualification
  addQualification(qualification: string) {
    if(qualification === '') {
      openToast(this.snackBar, `Bitte gib eine Qualifikation an`, true);
      return;
    }
    this.qualificationService.post(qualification, () => { //on success
      this.qualifications$ = this.qualificationService.getQualifications();
      openToast(this.snackBar, `Qualifikation '${qualification}' gespeichert`, false);
    }, (error) => { //on error
      openToast(this.snackBar, `Fehler beim Speichern der Qualifikation '${qualification}'`, true);
      openMessageDialog(this.dialog, error)
    });
  }

  removeQualification() {
    if (!this.activeQualification || this.activeQualification.id === undefined || this.activeQualification.id === null) return;
      this.qualificationService.delete(this.activeQualification.id, () => { //on success
        openToast(this.snackBar, `Qualifikation '${this.activeQualification?.skill}' gelöscht`, false);
        this.qualificationService.loadData(() => {
          this.activeQualification = null;
        });
      }, (error) => { //on error
        openToast(this.snackBar, `Fehler beim Löschen der Qualifikation '${this.activeQualification?.skill}'`, true);
        openMessageDialog(this.dialog, error);
      });
    }

}
