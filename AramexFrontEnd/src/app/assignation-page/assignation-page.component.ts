import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assignation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assignation-page.component.html',
  styleUrl: './assignation-page.component.css',
})
export class AssignationPageComponent implements OnInit {
  courierName: string = '';
  orderId: string = '';
  successMsg: string = '';
  errorMsg: string = '';
  isSuccess: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    console.log('Order ID:', this.orderId);
  }

  assignOrderToCourier(): void {
    if (this.courierName) {
      this.http
        .put(
          `http://127.0.0.1:8000/addOrder/${this.courierName}/${this.orderId}`,
          {}
        )
        .subscribe({
          next: () => {
            this.successMsg = 'Order assigned to courier successfully!';
            this.errorMsg = '';
            this.isSuccess = true;
          },
          error: (error) => {
            console.error('Error assigning courier:', error);
            this.errorMsg = 'Failed to assign order to courier.';
            this.successMsg = '';
            this.isSuccess = false;
          },
        });
    } else {
      this.errorMsg = 'Please enter a courier name.';
      this.successMsg = '';
      this.isSuccess = false;
    }
  }
}
