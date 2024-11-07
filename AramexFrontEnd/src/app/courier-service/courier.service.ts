import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CourierService {
  private apiUrl = 'http://127.0.0.1:8000';
  private courierName: string = '';

  constructor(private http: HttpClient) {}

  setCourierName(courierName: string) {
    this.courierName = courierName;
  }

  // fetch orders assigned to a specific courier
  getAssignedOrders(courierId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCourierOrders`, {
      params: new HttpParams().set('name', this.courierName),
    });
  }

  // update the status of an order by courier
  updateOrderStatus(
    courierId: string,
    orderId: string,
    status: string
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateOrderStatus`, null, {
      params: new HttpParams()
        .set('id', courierId)
        .set('orderId', orderId)
        .set('status', status),
    });
  }
}
