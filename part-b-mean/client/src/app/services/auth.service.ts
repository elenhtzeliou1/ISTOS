import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  get token(): string | null {
    return localStorage.getItem('token');
  }
  get user(): any | null {
    const raw = localStorage.getItem('activeUser');
    return raw ? JSON.parse(raw) : null;
  }
  get isLoggedIn(): boolean {
    return !!this.token;
  }

  setSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('activeUser', JSON.stringify(user));
    localStorage.setItem('activeUserId', user?._id); // optional
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('activeUser');
    localStorage.removeItem('activeUserId');
  }
}
