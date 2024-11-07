import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { UserComponent } from './user/user.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { UserOrderDetailsComponent } from './user-order-details/user-order-details.component';
import { AdminComponent } from './admin/admin.component';
import { AllTheOrdersComponent } from './all-the-orders/all-the-orders.component';
import { AssignedOrdersComponent } from './assigned-orders/assigned-orders.component';
import { CourierHomePageComponent } from './courier-home-page/courier-home-page.component';
import { AdminOrderViewComponent } from './admin-order-view/admin-order-view.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'user', component: UserComponent },
  { path: 'orders', component: UserOrdersComponent },
  { path: 'order/:id', component: UserOrderDetailsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'allOrders', component: AllTheOrdersComponent },
  { path: '/assignedOrders', component: AssignedOrdersComponent },
  { path: '/courier', component: CourierHomePageComponent },
  { path: 'admin/orders/:id', component: AdminOrderViewComponent },
];
