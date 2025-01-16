import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {QualificationService} from "../service/qualification.service";
import {AsyncPipe} from "@angular/common";
import {Qualification} from "../Qualification";

@Component({
  selector: 'app-qualifikations',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './qualifikations.component.html',
  styleUrl: './qualifikations.component.css'
})
export class QualifikationsComponent {
  bearer: string = '';
  qualifications$: Observable<Qualification[]>;

  constructor(
    private http: HttpClient,
    private qualificationService: QualificationService) {
    this.qualifications$ = this.qualificationService.getQualifications(); // Use the service to get employees
  }

  ngOnInit(): void {
    this.qualificationService.loadData(); // Load the data when the component initializes
  }
}
