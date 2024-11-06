import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CourierService } from '../courier-service/courier.service';


@Component({
  selector: 'app-assigned-orders',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './assigned-orders.component.html',
  styleUrl: './assigned-orders.component.css'
})
export class AssignedOrdersComponent implements OnInit {
  assignedOrders: any[] = [];
  //@Shehabenani !!!!!!important make it like the user service so i want to trace and get the id of the courier after he logs in
  courierId = 'get the id'; //implement it in the courier-service like we did in userOwner 
  // na b2ol n7otaha fel url zai ma 3mlna fel orderId l3al ashraf iwafek

  constructor(private courierService: CourierService) {}

  ngOnInit(): void {
    this.loadAssignedOrders();
  }

  loadAssignedOrders() {
    this.courierService.getAssignedOrders(this.courierId).subscribe(
      (response) => {
        this.assignedOrders = response.orders;
      },
      (error) => {
        console.error('Error loading assigned orders:', error);
      }
    );
  }

  // Function to accept an order
  acceptOrder(orderId: string) {
    this.updateOrderStatus(orderId, 'accepted');
  }

  // Function to decline an order
  declineOrder(orderId: string) {
    this.updateOrderStatus(orderId, 'declined');
  }

  private updateOrderStatus(orderId: string, status: string) {
    this.courierService.updateOrderStatus(this.courierId, orderId, status).subscribe(
      () => {
        this.loadAssignedOrders(); // Refresh the list
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
  }
}
