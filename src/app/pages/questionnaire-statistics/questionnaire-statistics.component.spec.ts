import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireStatisticsComponent } from './questionnaire-statistics.component';

describe('QuestionnaireStatisticsComponent', () => {
  let component: QuestionnaireStatisticsComponent;
  let fixture: ComponentFixture<QuestionnaireStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
