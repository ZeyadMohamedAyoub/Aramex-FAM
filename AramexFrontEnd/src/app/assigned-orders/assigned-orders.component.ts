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
  statuses: string[] = ['picked up', 'in transit', 'delivered']; //to implement onstatus change

//userService to get the user id
  constructor(private courierService: CourierService, private userService: UserService) {}

  ngOnInit(): void {
    this.courierName = this.userService.getUsername();
    this.fetchAssignedOrders();
  }
//to get the assigned orders from the courier service
  fetchAssignedOrders() {
    this.courierService.getAssignedOrders(this.courierName).subscribe({
      next: (response) => {
        this.assignedOrders = response.orders;
      },
      error: (error) => {
        console.error('Error loading assigned orders:', error);
        this.errorMsg = 'Failed to load assigned orders';
      }
    });
  }

  //when the courier accepts the order trigger this function from the courier service
  acceptOrder(orderId: string) {
    this.updateOrderStatus(orderId, 'accepted');
  }

  declineOrder(orderId: string) {
    this.updateOrderStatus(orderId, 'declined');
  }

//to update the order status
  private updateOrderStatus(orderId: string, status: string) {
    //get the user id from the user service storred when the user logs in
    this.courierId = this.userService.getUserId(); //was set in the login component and got from the user-service
    this.courierService.updateOrderStatus(this.courierId, orderId, status).subscribe({
      next: (response) => {
        this.successMsg = 'Order status updated successfully';
        this.errorMsg = '';
        this.fetchAssignedOrders();// to refresh the list
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.errorMsg = 'Failed to update order status';
        this.successMsg = '';
      }
    });
  }

  //to implement onstatus change from ui dropdown
  onStatusChange(orderId: any, newStatus: string) {
    this.updateOrderStatus(orderId, newStatus);
  }
}
