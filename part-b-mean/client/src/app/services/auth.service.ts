import { Injectable } from '@angular/core';

/**
 * AuthService
 *
 * Central place for handling authentication state on the client.
 * This service:
 * - stores JWT token
 * - stores the active user profile
 * - exposes helpers for login status checks
 *
 * Data is persisted in localStorage so the session survives page reloads.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Returns the current JWT token from localStorage.
   * Used by AuthInterceptor to attach Authorization headers.
   */
  get token(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Returns the currently logged-in user object from localStorage.
   * Parsed from JSON or null if no user is stored.
   */
  get user(): any | null {
    const raw = localStorage.getItem('activeUser');
    return raw ? JSON.parse(raw) : null;
  }

  /**
   * Convenience getter to check authentication state.
   * True if a token exists, false otherwise.
   */
  get isLoggedIn(): boolean {
    return !!this.token;
  }

  /**
   * Saves authentication session after successful login.
   *
   * Stores:
   * - JWT token
   * - user profile object
   * - user id (optional convenience key)
   */
  setSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('activeUser', JSON.stringify(user));
    localStorage.setItem('activeUserId', user?._id); // optional convenience key
  }

  /**
   * Clears authentication session.
   *
   * Called on logout or when token becomes invalid/expired.
   * Removes all auth-related data from localStorage.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('activeUser');
    localStorage.removeItem('activeUserId');
  }
}
