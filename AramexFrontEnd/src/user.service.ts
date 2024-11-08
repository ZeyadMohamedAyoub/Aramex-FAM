import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  //private userId: string
  private userOwner: string = '';
  private role: string = '';
  private userId: string = '';

  setUsername(name: string) {
    this.userOwner = name;
  }

  setUserRole(role: string) {
    this.role = role;
  }
//added the setUser id and get the user id for the login component
  setUserId(userId: string) {
    this.userId = userId;
  }

  getUsername(): string {
    return this.userOwner;
  }

  getUserId(): string {
    return this.userId;
  }
}
