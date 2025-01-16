import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-qualification-list-row',
  standalone: true,
  imports: [],
  templateUrl: './qualification-list-row.component.html',
  styleUrl: './qualification-list-row.component.css'
})
export class QualificationListRowComponent
{
  @Input() skill?: string;
}
