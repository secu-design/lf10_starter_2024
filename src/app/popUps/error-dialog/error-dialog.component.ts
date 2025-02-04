import {Component, Inject} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {HttpErrorResponse} from "@angular/common/http";
import {JsonPipe, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle
  ],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.css'
})
export class ErrorDialogComponent
{
  protected error: HttpErrorResponse;
  protected errorMessage: string = "";
  protected showTechnicalDetails = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { error: HttpErrorResponse, message: string }
  )
  {
    console.log(data.error);
    this.error = data.error;
    this.errorMessage = data.error.error.message;
  }

  toggleTechnicalDetails()
  {
    this.showTechnicalDetails = !this.showTechnicalDetails;
  }
}
