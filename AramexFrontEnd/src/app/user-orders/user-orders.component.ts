import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from '../../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  userOwner: string = '';
  orders: any[] = []; //initializing the order list with empty array

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.userOwner = this.userService.getUsername();
    this.fetchOrders();
  }

  //function to fetch the order from the database
  fetchOrders() {
    const url = `http://127.0.0.1:8000/getOrders?username=${this.userOwner}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      },
      complete: () => {
        console.log('Order fetch completed');
      },
    });
  }
}
