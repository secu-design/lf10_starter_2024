import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Employee} from "../Employee";
import {EmployeeService} from "../employee-service.service";
import {FormsModule} from "@angular/forms";
import {getHtmlTagDefinition} from "@angular/compiler";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  bearer: string = '';
  employees$: Observable<Employee[]>;

  toggleCheckbox(_id:any)
  {
    let id = _id.toString();
    let checkbox = <HTMLInputElement> document.getElementById(id);
    let div = <HTMLInputElement> document.getElementById(id +"-test");
    if (checkbox.checked) {
      div.style.backgroundColor = 'lightblue'; // Change to your desired color
      div.style.border = 'lightblue solid 2px';
      div.style.borderRadius = '4px';
    } else {
      div.style.backgroundColor = ''; // Reset to default
      div.style.border = 'white solid 2px';
      div.style.borderRadius = '4px';
    }
  }

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService) {
    this.employees$ = this.employeeService.getEmployees(); // Use the service to get employees
  }

  ngOnInit(): void {
    this.employeeService.loadData(); // Load the data when the component initializes
  }

  protected readonly toSignal = toSignal;
  protected readonly toString = toString;
}
