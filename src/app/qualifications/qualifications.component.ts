import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {QualificationService} from "../service/qualification.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Qualification} from "../Qualification";

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
export class QualificationsComponent
{
  qualifications$: Observable<Qualification[]>;
  activeQualification: Qualification | null = null;

  constructor(
    private qualificationService: QualificationService) {
    this.qualifications$ = this.qualificationService.getQualifications();
  }

  ngOnInit(): void {
    this.qualificationService.loadData();
  }

  setActiveQualification(qualification: Qualification) {
    this.activeQualification = qualification;
  }

  addQualification(qualification: string) {
    this.qualificationService.post(qualification, () => {
      this.qualifications$ = this.qualificationService.getQualifications(); // Liste aktualisieren
    });
  }

  removeQualification() {
    if (this.activeQualification && this.activeQualification.id !== undefined) {
      this.qualificationService.delete(this.activeQualification.id, () => {
        this.qualificationService.loadData(() => {
          this.activeQualification = null; // Aktive Qualifikation zurücksetzen
        });
      });
    }
  }
}
