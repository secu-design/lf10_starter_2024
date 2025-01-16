import {Component, Input} from '@angular/core';
import {QualificationListRowComponent} from "../qualification-list-row/qualification-list-row.component";
import {Employee} from "../Employee";
import {NgForOf} from "@angular/common";
import {Qualification} from "../Qualification";

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    QualificationListRowComponent,
    NgForOf
  ],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent
{
  @Input() employee: Employee = new Employee(
    1,
    'Doe',
    'John',
    'Teststraße 1',
    '12345',
    'Testcity',
    '0173 2334855',
    [
      new Qualification('Java', 0),
      new Qualification('Angular', 1)
    ]
  );
}
