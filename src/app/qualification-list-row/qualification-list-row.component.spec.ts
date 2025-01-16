import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationListRowComponent } from './qualification-list-row.component';

describe('QualificationListRowComponent', () => {
  let component: QualificationListRowComponent;
  let fixture: ComponentFixture<QualificationListRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualificationListRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationListRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
