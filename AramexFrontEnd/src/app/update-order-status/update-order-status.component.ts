import { Component, Input } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CourierService } from '../courier-service/courier.service';

@Component({
  selector: 'app-update-order-status',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './update-order-status.component.html',
  styleUrl: './update-order-status.component.css'
})
export class UpdateOrderStatusComponent {
  @Input() orderId!: string;
  @Input() courierId!: string;


  constructor(private courierService: CourierService) {}

  updateStatus(newStatus: string) {
    this.courierService.updateOrderStatus(this.courierId, this.orderId, newStatus).subscribe({
      next: () => {
        console.log('Order status updated successfully');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }
}
