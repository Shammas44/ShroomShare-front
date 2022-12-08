import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable,from,delayWhen } from 'rxjs';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthResponse,AuthRequest } from '../models/auth';
import { User } from '../models/users';
import { environment } from "src/environments/environment";

// const API_URL = "https://shroom-share.onrender.com/api";
const API_URL = environment.apiUrl;

/**
 * Authentication service for login/logout.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  #auth$: ReplaySubject<AuthResponse | undefined>;

  constructor(private http: HttpClient, private storage: Storage) {
    this.#auth$ = new ReplaySubject(1);
     this.storage.get('auth').then((auth) => {
    // Emit the loaded value into the observable stream.
    this.#auth$.next(auth);
  });
  }

  isAuthenticated$(): Observable<boolean> {
    return this.#auth$.pipe(map((auth) => Boolean(auth)));
  }

  getUser$(): Observable<User | undefined> {
    return this.#auth$.pipe(map((auth) => auth?.user));
  }

  getToken$(): Observable<string | undefined> {
    return this.#auth$.pipe(map((auth) => auth?.token));
  }

  logIn$(authRequest: AuthRequest): Observable<User> {
    const authUrl = `${API_URL}/auth`;
    console.log({ authUrl, authRequest });
    return this.http.post<AuthResponse>(authUrl, authRequest).pipe(
      delayWhen((auth:AuthResponse) => this.saveAuth$(auth)),
      map((auth) => {
        this.#auth$.next(auth);
        console.log(`User ${auth.user.username} logged in`);
        return auth.user;
      })
    );
  }

  private saveAuth$(auth: AuthResponse): Observable<void> {
    return from(this.storage.set('auth', auth));
  }

  logOut(): void {
    this.#auth$.next(undefined);
    this.storage.remove('auth');
    console.log('User logged out');
  }
}
