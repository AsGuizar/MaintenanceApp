import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isRegistering: boolean = false; // Track if the user is registering

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(['/home']);
    } else {
      alert('Login failed! Please check your credentials.');
    }
  }

  onRegister() {
    if (this.authService.register(this.email, this.password)) {
      alert('Registration successful! You can now log in.');
      this.isRegistering = false; // Switch back to login view
    } else {
      alert('Registration failed! Please try again.');
    }
  }

  toggleRegister() {
    this.isRegistering = !this.isRegistering; // Toggle registration view
  }
}
