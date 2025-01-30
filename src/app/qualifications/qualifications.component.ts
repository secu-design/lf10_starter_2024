import {Component} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {QualificationService} from "../service/qualification.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Qualification} from "../Qualification";
import {openMessageDialog, openToast} from "../utils/GlobalFunctions";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons/faAdd";

@Component({
  selector: 'app-qualifications',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    FontAwesomeModule
  ],
  templateUrl: './qualifications.component.html',
  styleUrl: './qualifications.component.css'
})
export class QualificationsComponent {
  qualifications$: Observable<Qualification[]>;
  activeQualification: Qualification | null = null;
  qualifications: Qualification[] | null = null;

  // Filter
  private searchTerm$ = new BehaviorSubject<string>('');
  filteredQualifications$: Observable<Qualification[]>;

  // Icons
  protected readonly faTrash = faTrash;
  protected readonly faAdd = faAdd;

  constructor(
    private qualificationService: QualificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar)
  {
    this.qualifications$ = this.qualificationService.getQualifications();

    this.qualifications$.subscribe((qualifications) => {
      this.qualifications = qualifications;
    });

    this.filteredQualifications$ = combineLatest([this.qualifications$, this.searchTerm$]).pipe(
      map(([qualifications, searchTerm]) => {
        const filters = searchTerm.toLowerCase().split(',').map(f => f.trim());
        return qualifications.filter(qualification =>
          filters.every(filter =>
            `${qualification.id} ${qualification.skill}`.toLowerCase().includes(filter)));
      })
    );
  }

  ngOnInit(): void {
    this.qualificationService.loadData();
  }

  setActiveQualification(qualification: Qualification) {
    this.activeQualification = qualification;
  }

  //addQualification and removeQualification() only show a message dialog when an error happens, in case you want to add/remove multiple qualification
  addQualification(qualification: string) {
    if(qualification === '') {
      openToast(this.snackBar, `Bitte gib eine Qualifikation an`, true);
      return;
    }
    if(this.qualifications == null || this.qualifications.find((qual) =>{
      return qual.skill == qualification;
    })) {
      openToast(this.snackBar, `Die Qualifikation '${qualification}' existiert schon`, true);
      return;
    }


    this.qualificationService.post(qualification, () => { //on success
      this.qualifications$ = this.qualificationService.getQualifications();
      openToast(this.snackBar, `Qualifikation '${qualification}' gespeichert`, false);
    }, (error) => { //on error
      //openToast(this.snackBar, `Fehler beim Speichern der Qualifikation '${qualification}'`, true);
      openMessageDialog(this.dialog, error)
    });
  }

  removeQualification() {
    if (!this.activeQualification || this.activeQualification.id === undefined || this.activeQualification.id === null) return;
      this.qualificationService.delete(this.activeQualification.id, () => { //on success
        openToast(this.snackBar, `Qualifikation '${this.activeQualification?.skill}' gelöscht`, false);
        this.qualificationService.loadData(() => {
          this.activeQualification = null;
        });
      }, (error) => { //on error
        openToast(this.snackBar, `Fehler beim Löschen der Qualifikation '${this.activeQualification?.skill}'`, true);
        openMessageDialog(this.dialog, error);
      });
    }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm$.next(input.value);
  }
}
