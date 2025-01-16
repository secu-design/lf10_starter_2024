import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {QualificationService} from "../service/qualification.service";
import {AsyncPipe} from "@angular/common";
import {Qualification} from "../Qualification";

@Component({
  selector: 'app-qualifications',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './qualifications.component.html',
  styleUrl: './qualifications.component.css'
})
export class QualificationsComponent {
  qualifications$: Observable<Qualification[]>;

  constructor(
    private qualificationService: QualificationService) {
    this.qualifications$ = this.qualificationService.getQualifications(); // Use the service to get employees
  }

  ngOnInit(): void {
    this.qualificationService.loadData(); // Load the data when the component initializes
  }
}
