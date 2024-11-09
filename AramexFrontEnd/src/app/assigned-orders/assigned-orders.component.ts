import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CourierService } from '../courier-service/courier.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-assigned-orders',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './assigned-orders.component.html',
  styleUrl: './assigned-orders.component.css'
})
export class AssignedOrdersComponent implements OnInit {
  assignedOrders: any[] = [];
  courierName: string = '';
  courierId: string = '';
  errorMsg: string = '';
  successMsg: string = '';
  statuses: string[] = ['accepted', 'picked up', 'in transit', 'delivered', 'cancelled'];

  constructor(private courierService: CourierService, private userService: UserService) {}

  ngOnInit(): void {
    this.courierName = this.userService.getUsername();
    this.courierId = this.userService.getUserId();
    this.fetchAssignedOrders();
  }

  fetchAssignedOrders() {
    this.courierService.getAssignedOrders(this.courierName).subscribe({
      next: (response) => {
        //double checking for duplicates handling and i solved it in the backend
        const uniqueOrdersMap = new Map<string, any>();
        response.orders.forEach((order: any) => {
          uniqueOrdersMap.set(order._id, { ...order, newStatus: order.status });
        });
        this.assignedOrders = Array.from(uniqueOrdersMap.values());
        console.log(this.assignedOrders);
      },
      error: (error) => {
        console.error('Error loading assigned orders:', error);
        this.errorMsg = 'Failed to load assigned orders';
      }
    });
  }

  acceptOrder(orderId: string) {
    this.courierService.acceptOrder(this.courierId, orderId).subscribe({
      next: (response) => {
        this.successMsg = 'Order accepted successfully';
        this.errorMsg = '';
        this.fetchAssignedOrders();
      },
      error: (error) => {
        console.error('Error accepting order:', error);
        this.errorMsg = 'Failed to accept order';
        this.successMsg = '';
      }
    });
  }

  declineOrder(orderId: string) {
    this.courierService.declineOrder(this.courierId, orderId).subscribe({
      next: (response) => {
        this.successMsg = 'Order declined successfully';
        this.errorMsg = '';
        this.fetchAssignedOrders();
      },
      error: (error) => {
        console.error('Error declining order:', error);
        this.errorMsg = 'Failed to decline order';
        this.successMsg = '';
      }
    });
  }

  private updateOrderStatus(orderId: string, status: string) {
    this.courierService.updateOrderStatus(this.courierId, orderId, status).subscribe({
      next: (response) => {
        this.successMsg = 'Order status updated successfully';
        this.errorMsg = '';
        this.fetchAssignedOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.errorMsg = 'Failed to update order status';
        this.successMsg = '';
      }
    });
  }

  onStatusChange(orderId: any, newStatus: string) {
    this.updateOrderStatus(orderId, newStatus);
  }
  
  trackByOrderId(index: number, order: any): string {
    return order._id;
  }
}