import {Component, Inject} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-busy',
  standalone: true,
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './busy.component.html',
  styleUrl: './busy.component.css'
})
export class BusyComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {

  }


}
