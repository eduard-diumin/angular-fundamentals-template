import { Injectable, Inject } from "@angular/core";

const TOKEN = "SESSION_TOKEN"; // Use this constant for the session storage entry key

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  constructor(@Inject("Window") private window: Window) {}

  setToken(token: string): void {
    this.window.sessionStorage.setItem(TOKEN, token);
  }

  getToken(): string | null {
    return this.window.sessionStorage.getItem(TOKEN);
  }

  deleteToken(): void {
    this.window.sessionStorage.removeItem(TOKEN);
  }
}
