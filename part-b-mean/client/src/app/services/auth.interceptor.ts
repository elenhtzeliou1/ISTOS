import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  /**
   * Intercepts every outgoing HTTP request made via Angular HttpClient.
   *
   * If a JWT token exists in AuthService, it:
   * - clones the request (HttpRequest objects are immutable)
   * - adds the Authorization header: "Bearer <token>"
   * - forwards the modified request
   *
   * If no token exists, it forwards the original request untouched.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Read current token from AuthService (usually stored in localStorage + memory)
    const token = this.auth.token;

    // If user is not logged in, do not attach Authorization header
    if (!token) return next.handle(req);

    // Clone the request and attach the Bearer token header
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    // Continue the request chain with the modified request
    return next.handle(authReq);
  }
}
