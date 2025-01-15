import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Employee} from "../Employee";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  bearer: string = '';
  employees$: Observable<Employee[]>;

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService) {
    this.employees$ = of([]);
    this.init();
  }

  async init() {
    try {
      this.bearer = await this.keycloakService.getToken();
      this.fetchData();
    } catch (error) {
      console.error('Failed to get token', error);
    }
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }
}
