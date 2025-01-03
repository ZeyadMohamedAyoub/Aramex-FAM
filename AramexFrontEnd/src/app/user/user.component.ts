import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  constructor(private router: Router) {}

  ToCreateOrderComponent() {
    this.router.navigate(['/create-order']);
  }

  ToUserOrders() {
    this.router.navigate(['/orders']);
  }
}
