import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-order-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-order-view.component.html',
  styleUrls: ['./admin-order-view.component.css'],
})
export class AdminOrderViewComponent implements OnInit {
  order: any;
  orderId: string = '';
  statuses = ['picked up', 'in transit', 'delivered'];
  selectedStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.fetchOrderDetails();
  }

  fetchOrderDetails() {
    this.http.get(`http://127.0.0.1:8000/orders/${this.orderId}`).subscribe({
      next: (data) => (this.order = data),
      error: (error) => console.error('Error fetching order details:', error),
    });
  }

  deleteOrder() {
    const name = this.userService.getUsername();
    this.http
      .delete(`http://127.0.0.1:8000/deleteOrder/${this.orderId}/${name}`)
      .subscribe({
        next: () => {
          alert('Order deleted successfully');
          this.router.navigate(['/admin/orders']);
        },
        error: (error) => console.error('Error deleting order:', error),
      });
  }

  updateOrderStatus() {
    if (this.selectedStatus) {
      this.http
        .put(
          `http://127.0.0.1:8000/updateOrderStatusAdmin/${this.orderId}/status`,
          { status: this.selectedStatus }
        )
        .subscribe({
          next: () => alert('Order status updated successfully'),
          error: (error) => console.error('Error updating status:', error),
        });
    } else {
      alert('Please select a status');
    }
  }

  ToAssignationPage() {
    this.router.navigate(['/assign']);
  }
}
