// auth.service.ts - Manages user authentication and local storage
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;

  constructor() {}

  login(email: string, password: string): boolean {
    const user = { email, password }; // In a real app, you'd validate against a database
    const storedUser = localStorage.getItem('user');

    if (storedUser && JSON.parse(storedUser).email === email && JSON.parse(storedUser).password === password) {
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  register(email: string, password: string): boolean {
    const user = { email, password };
    localStorage.setItem('user', JSON.stringify(user));
    return true; // Registration successful
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('user');
  }
}
