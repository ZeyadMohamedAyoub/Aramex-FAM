import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  pickupLocation: string = '';
  dropoffLocation: string = '';
  packageDetails: string = '';
  deliveryTime: string = '';
  isOrderCreated: boolean = false;
  errorMsg: string = '';

  //injected the userService
  constructor(private http: HttpClient ,private userService: UserService) {}

  // Function to send data to the server
  sendDataToServer(orderData: any) {
    const url = 'http://127.0.0.1:8000/orders';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<HttpResponse<any>>(url, orderData, { headers, observe: 'response' });
  }

  //when user submits the cod it takes the input send data to server check status 201,
  // if 201 res as created successfully don't show error message clear the form
  // if error then send order failed prompt to try again
  onSubmit(orderForm: NgForm) {
    if (orderForm.valid) {
      //which will be sent to the backend 
      const orderData = {
        pickupLocation: this.pickupLocation,
        dropoffLocation: this.dropoffLocation,
        packageDetails: this.packageDetails,
        deliveryTime: this.deliveryTime,
        userOwner: this.userService.getUsername() //to retrieve and send the username
      };
      
      // Resetting status messages
      this.isOrderCreated = false;
      this.errorMsg = '';

      // Sending data to server and handling response
      this.sendDataToServer(orderData).subscribe({
        next: (response) => {
          if (response.status === 201) { // Assuming 201 for a successful creation
            console.log('Order created successfully:', response);
            this.isOrderCreated = true;
            this.errorMsg = '';
            orderForm.reset(); // Clear form after successful submission
          } else {
            console.error('Unexpected response:', response);
            this.errorMsg = 'Order creation failed! Please try again.';
          }
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.errorMsg = 'Order creation failed! Please try again later.';
          this.isOrderCreated = false;
        },
      });
    } else {
      console.log('Form is invalid');
      this.errorMsg = 'Please complete all required fields correctly.';
    }
  }
}
