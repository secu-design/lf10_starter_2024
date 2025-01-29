import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {QualificationsComponent} from "./qualifications/qualifications.component";
import {EmployeeDetailsComponent} from "./employee-details/employee-details.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faSignOut} from "@fortawesome/free-solid-svg-icons";
import {TokenService} from "./service/token.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeListComponent, QualificationsComponent, EmployeeDetailsComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent
{
  title = 'lf10StarterNew';
  protected readonly faSignOut = faSignOut;

  constructor(private tokenService: TokenService)
  {
  }

  logout()
  {
    this.tokenService.logout();
  }
}
