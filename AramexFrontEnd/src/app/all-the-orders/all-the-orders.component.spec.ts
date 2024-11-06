import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTheOrdersComponent } from './all-the-orders.component';

describe('AllTheOrdersComponent', () => {
  let component: AllTheOrdersComponent;
  let fixture: ComponentFixture<AllTheOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTheOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTheOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
