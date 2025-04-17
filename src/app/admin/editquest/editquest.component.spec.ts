import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditquestComponent } from './editquest.component';

describe('EditquestComponent', () => {
  let component: EditquestComponent;
  let fixture: ComponentFixture<EditquestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditquestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditquestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
