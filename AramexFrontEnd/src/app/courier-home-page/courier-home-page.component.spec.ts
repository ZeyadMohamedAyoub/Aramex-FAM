import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierHomePageComponent } from './courier-home-page.component';

describe('CourierHomePageComponent', () => {
  let component: CourierHomePageComponent;
  let fixture: ComponentFixture<CourierHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
