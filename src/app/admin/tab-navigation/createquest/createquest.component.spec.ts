import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatequestComponent } from './createquest.component';

describe('CreatequestComponent', () => {
  let component: CreatequestComponent;
  let fixture: ComponentFixture<CreatequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
