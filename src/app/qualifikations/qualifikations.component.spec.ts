import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifikationsComponent } from './qualifikations.component';

describe('QualifikationsComponent', () => {
  let component: QualifikationsComponent;
  let fixture: ComponentFixture<QualifikationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualifikationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualifikationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
