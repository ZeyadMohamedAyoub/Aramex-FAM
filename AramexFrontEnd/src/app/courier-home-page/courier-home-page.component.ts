import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courier-home-page',
  standalone: true,
  imports: [],
  templateUrl: './courier-home-page.component.html',
  styleUrl: './courier-home-page.component.css',
})
export class CourierHomePageComponent {
  constructor(private router: Router) {}

  ToAssignedOrder() {
    this.router.navigate(['/assignedOrders']);
  }
}
