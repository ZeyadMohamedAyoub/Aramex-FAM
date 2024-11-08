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
  styleUrl: './user-order-details.component.css',
})
export class UserOrderDetailsComponent {
  orderId: string = ''; //send this order id to the server
  orderDetails: any = null; //get orderDetails from the backend
  orderStatus: string = '';
  errorMsg: string = '';
  successMsg: string = '';
  courierInfo: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || ''; //get the order id from path and assignn to orderId to send back to server
    this.fetchOrderDetails(); //fetch details of this order id
  }

  //on init thus function will be called automatically
  fetchOrderDetails() {
    this.http.get(`http://127.0.0.1:8000/orders/${this.orderId}`).subscribe({
      next: (response) => {
        this.orderDetails = response;
        if (this.orderDetails.courierId) {
          this.fetchCourierInfo(this.orderDetails.courierId);
        }
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.errorMsg = 'Failed to load order details. Please try again later.';
      },
    });
  }

  fetchCourierInfo(courierId: string) {
    this.http.get(`http://127.0.0.1:8000/users/${courierId}`).subscribe({
      next: (response) => {
        this.courierInfo = response;
      },
      error: (error) => {
        console.error('Error fetching courier info:', error);
        this.errorMsg = 'Failed to load courier information.';
      },
    });
  }

  //to cancel the order iff the order is pending
  cancelOrder() {
    if (this.orderDetails?.status !== 'pending') return;

    this.orderStatus = 'cancelled';
    // Pass orderId as a query parameter
    this.http
      .put(
        `http://127.0.0.1:8000/updateOrderStatusUser/${this.orderId}/${this.orderStatus}`,
        {}
      )
      .subscribe({
        next: () => {
          this.successMsg = 'Order cancelled successfully.';
          this.orderDetails.status = 'cancelled';
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.errorMsg = 'Failed to cancel the order. Please try again later.';
        },
      });
  }
}
