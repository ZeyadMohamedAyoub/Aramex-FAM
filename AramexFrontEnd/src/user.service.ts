import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  //private userId: string
  private userOwner: string = '';
  private role: string = '';

  setUsername(name: string) {
    this.userOwner = name;
  }

  setUserRole(role: string) {
    this.role = role;
  }

  getUsername(): string {
    return this.userOwner;
  }
}
