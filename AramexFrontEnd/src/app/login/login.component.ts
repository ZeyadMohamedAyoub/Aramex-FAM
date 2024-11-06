import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  name: string = '';
  password: string = '';
  isloggedIn: boolean = false;
  errorMsg: string = ''; //added a error mesg

  //injected the userService
  constructor(private http: HttpClient, private userService: UserService) {}

  ////////////////function that sends data to the HTTP /////////////////
  sendDataToServer(name: string, password: string): Observable<any> {
    const url = 'http://127.0.0.1:8000/authenticate';

    const body = `name=${encodeURIComponent(
      name
    )}&password=${encodeURIComponent(password)}`;

    console.log('Payload:', body);

    return this.http.post<HttpResponse<any>>(url, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      observe: 'response',
    });
  }

  //////// function for the click button ////////////
  onSubmit() {
    const userData = {
      name: this.name,
      password: this.password,
    };

    console.log('Attempting to log in:', userData);

    this.sendDataToServer(this.name, this.password).subscribe({
      next: (response) => {
        if (response.status == 200) {
          this.isloggedIn = true;
          console.log('Logged in successfully!', response);
          this.errorMsg = '';
          this.userService.setUsername(this.name); //to store the userName
        } else {
          console.error('Invalid username or password');
          this.errorMsg = 'Invalid UserName or Password';
          this.isloggedIn = false;
        }
      },
      error: (error) => {
        this.isloggedIn = false;
        this.errorMsg = 'Invalid username or password';
        console.error('Error occurred:', error);
      },
    });
  }
}
