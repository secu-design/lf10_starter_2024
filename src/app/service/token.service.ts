import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private bearerToken: string = '';

  constructor(private keycloakService: KeycloakService) {
    this.loadToken(); // Load token on service initialization
  }

  // Load the token and update the BehaviorSubject
  private async loadToken() {
    const token = await this.keycloakService.getToken();
    this.bearerToken = token;
    this.tokenSubject.next(token);
  }

  // Public method to get the current token as a string
  async getToken(): Promise<string> {
    // Refresh the token if needed
    const isTokenExpired = await this.keycloakService.isTokenExpired();
    if (isTokenExpired) {
      await this.refreshToken();
    }
    return this.bearerToken;
  }

  // Refresh the token
  private async refreshToken(): Promise<void> {
    await this.keycloakService.updateToken(30); // Refresh if token is expiring in the next 30 seconds
    const token = await this.keycloakService.getToken();
    this.bearerToken = token;
    this.tokenSubject.next(token);
  }

  // Observable for token changes
  getTokenObservable() {
    return this.tokenSubject.asObservable();
  }
}
