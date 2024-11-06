import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { error } from 'console';

@Component({
  selector: 'app-all-the-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-the-orders.component.html',
  styleUrl: './all-the-orders.component.css',
})
export class AllTheOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    const url = `http://127.0.0.1:8000/getOrders`;
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
