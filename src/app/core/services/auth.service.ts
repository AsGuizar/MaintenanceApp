import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;

  constructor() {}

  login(email: string, password: string): boolean {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email && user.password === password) {
        this.isLoggedIn = true;
        return true;
      }
    }
    return false;
  }

  register(email: string, password: string, name: string): boolean {
    const user = { email, password, name };
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

  getUserName(): string {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).name : 'User';
  }
}
