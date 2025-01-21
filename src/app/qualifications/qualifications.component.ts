import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {QualificationService} from "../service/qualification.service";
import {AsyncPipe} from "@angular/common";
import {Qualification} from "../Qualification";
import {QualificationListRowComponent} from "../qualification-list-row/qualification-list-row.component";

@Component({
  selector: 'app-qualifications',
  standalone: true,
  imports: [
    AsyncPipe,
    QualificationListRowComponent
  ],
  templateUrl: './qualifications.component.html',
  styleUrl: './qualifications.component.css'
})
export class QualificationsComponent
{
  qualifications$: Observable<Qualification[]>;

  constructor(
    private qualificationService: QualificationService) {
    this.qualifications$ = this.qualificationService.getQualifications(); // Use the service to get employees
  }

  ngOnInit(): void {
    this.qualificationService.loadData(); // Load the data when the component initializes
  }

  addQualification(qualification: string) {
    this.qualificationService.post(qualification)
    // 1. Wie aktualisiert man das HTML Element automatisch?
    // 2. Es muss eine Prüfung geben, damit Elemente nicht doppelt hinzugefügt werden. Das sollte der Service
    // sicherstellen.
  }

  removeQualification() {

  }
}
