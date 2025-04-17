import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireboxComponent } from './questionnairebox.component';

describe('QuestionnaireboxComponent', () => {
  let component: QuestionnaireboxComponent;
  let fixture: ComponentFixture<QuestionnaireboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
