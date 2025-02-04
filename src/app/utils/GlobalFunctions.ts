import {HttpErrorResponse} from "@angular/common/http";
import {ErrorDialogComponent} from "../popUps/error-dialog/error-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SuccessDialogComponent} from "../popUps/success-dialog/success-dialog.component";
import {BusyComponent} from "../popUps/busy/busy.component";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * Displays a dialog  that informs the user about an error or success of an api call
 * @param dialog
 * @param returnValue - value returned by the api method or a simple message string
 */
export function openMessageDialog(dialog: MatDialog, returnValue: any)
{
  if (returnValue instanceof HttpErrorResponse)
  {
    dialog.open(ErrorDialogComponent, {
      width: '800px',
      data: {
        error: returnValue, // Optional, only for errors
      },
    });
  } else if (typeof (returnValue) === "string")
  {
    dialog.open(SuccessDialogComponent, {
      width: '600px',
      data: {
        message: returnValue, // Optional, only for errors
      },
    });
  }
}

export function openToast(snackBar: MatSnackBar, message: string, isError: boolean = false, duration: number = 3000)
{
  snackBar.open(message, 'Close', {
    duration,
    panelClass: [isError ? 'toast-error' : 'toast-success'],
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}

let loadingDialogRef: MatDialogRef<BusyComponent> | null = null;

export function openBusyDialog(dialog: MatDialog, message: string = 'Loading...')
{
  if (!loadingDialogRef)
  {
    loadingDialogRef = dialog.open(BusyComponent, {
      disableClose: true, // Prevent users from closing the dialog
      data: {message},
    });
  }
}

export function closeBusyDialog()
{
  if (loadingDialogRef)
  {
    loadingDialogRef.close();
    loadingDialogRef = null;
  }
}
