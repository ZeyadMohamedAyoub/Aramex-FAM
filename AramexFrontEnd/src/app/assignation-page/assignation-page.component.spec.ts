import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignationPageComponent } from './assignation-page.component';

describe('AssignationPageComponent', () => {
  let component: AssignationPageComponent;
  let fixture: ComponentFixture<AssignationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
