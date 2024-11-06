import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-user-order-details',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './user-order-details.component.html',
  styleUrl: './user-order-details.component.css'
})
export class UserOrderDetailsComponent {
  orderId: string = '';//send this order id to the server 
  orderDetails: any = null; //get orderDetails from the backend
  errorMsg: string = '';
  successMsg: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || ''; //get the order id from path and assignn to orderId to send back to server
    this.fetchOrderDetails();//fetch details of this order id
  }

  //on init thus function will be called automatically
  fetchOrderDetails() {
    this.http.get(`http://127.0.0.1:8000/orders/${this.orderId}`).subscribe({

      next: (response) => {
        this.orderDetails = response;
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.errorMsg = 'Failed to load order details. Please try again later.';
      },
    });
  }

  //to cancel the order iff the order is pending
  cancelOrder() {
    if (this.orderDetails?.status !== 'pending') return;

    this.http.post(`http://127.0.0.1:8000/orders/cancel`, { orderId: this.orderId }).subscribe({
      next: () => {
        this.successMsg = 'Order canceled successfully.';
        this.orderDetails.status = 'canceled';
      },
      error: (error) => {
        console.error('Error canceling order:', error);
        this.errorMsg = 'Failed to cancel the order. Please try again later.';
      },
    });
  }
}
