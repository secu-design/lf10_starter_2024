import {Component, Inject} from '@angular/core';
import { MatFormFieldModule} from "@angular/material/form-field";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    NgForOf,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})


export class EditComponent {
  qualifications: string[] = ['Qualifikation 1', 'Qualifikation 2', 'Qualifikation 3','Qualifikation 1', 'Qualifikation 2', 'Qualifikation 3', 'Qualifikation 2', 'Qualifikation 3','Qualifikation 1', 'Qualifikation 2', 'Qualifikation 3', 'Qualifikation 2', 'Qualifikation 3','Qualifikation 1', 'Qualifikation 2', 'Qualifikation 3', 'Qualifikation 2', 'Qualifikation 3','Qualifikation 1', 'Qualifikation 2', 'Qualifikation 3'];


  constructor(
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onSave(): void {
    console.log('Speichern geklickt');
    this.dialogRef.close(this.data);
  }


}
