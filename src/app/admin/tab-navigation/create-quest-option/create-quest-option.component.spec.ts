import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestOptionComponent } from './create-quest-option.component';

describe('CreateQuestOptionComponent', () => {
  let component: CreateQuestOptionComponent;
  let fixture: ComponentFixture<CreateQuestOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuestOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuestOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
