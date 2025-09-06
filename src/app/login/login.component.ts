import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  //loginUrl='http://10.30.0.171:9090/api/login';
  //loginUrl:any='http://localhost:9090/api/login';
  loginUrl:any='http://192.168.31.205:9090/api/login';
  
  constructor(private http: HttpClient,private route:Router) {}

  onLogin() {
    this.http.post<any>(this.loginUrl, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {

        console.log(res);
        localStorage.setItem('token', res.token);
       
        this.route.navigate(['/employee']);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}