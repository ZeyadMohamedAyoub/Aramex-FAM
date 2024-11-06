import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { UserComponent } from './user/user.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { UserOrderDetailsComponent } from './user-order-details/user-order-details.component';
import { AdminComponent } from './admin/admin.component';
import { AllTheOrdersComponent } from './all-the-orders/all-the-orders.component';

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
];
