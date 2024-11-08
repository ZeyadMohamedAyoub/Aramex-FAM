import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourierService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

 

  // sending the name of the courier to the backend to get his assigned orders
  getAssignedOrders(name: string): Observable<any> {
    const params = new HttpParams().set('name', name);
    return this.http.get(`${this.apiUrl}/getCourierOrders`, { params });
  } 

  updateOrderStatus(courierId: string, orderId: string, status: string): Observable<any> {
    const params = new HttpParams()
      .set('id', courierId)
      .set('orderId', orderId)
      .set('status', status);
    return this.http.put(`${this.apiUrl}/updateOrderStatus`, null, { params });
  }
}
