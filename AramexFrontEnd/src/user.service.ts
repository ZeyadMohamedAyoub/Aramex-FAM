import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private userOwner: string = '';

  setUsername(name: string) {
    this.userOwner = name;
  }

  getUsername(): string {
    return this.userOwner;
  }
}
