import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly TokenKey = 'token';

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  get isLoadedUser(): boolean {
    return !!localStorage.getItem(this.TokenKey);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  loadCurrentUserWithToken(): Observable<void> {
    const token = localStorage.getItem(this.TokenKey);

    return this.loadCurrentUser(token);
  }

  loadCurrentUser(token: string): Observable<void> {
    if (token === null) {
      this.currentUserSource.next(null);

      return of(null);
    }

    let headers = new HttpHeaders();
    const bearerToken = `Bearer ${token}`;
    headers = headers.set('Authorization', bearerToken);
    const url = `${this.baseUrl}account`;

    return this.http
      .get<IUser>(url, {headers})
      .pipe(
        map((user: IUser) => {
          localStorage.setItem(this.TokenKey, user.token);
          this.currentUserSource.next(user);
        }),
      );
  }

  login(values: any) {
    const url = `${this.baseUrl}account/login`;

    return this.http
      .post<IUser>(url, values)
      .pipe(
        map((user: IUser) => {
          localStorage.setItem(this.TokenKey, user.token);
          this.currentUserSource.next(user);
        }),
      );
  }

  register(values: any) {
    const url = `${this.baseUrl}account/register`;

    return this.http
    .post<IUser>(url, values)
    .pipe(
      map((user: IUser) => {
        localStorage.setItem(this.TokenKey, user.token);
        this.currentUserSource.next(user);
      }),
    );
  }

  logout() {
    localStorage.removeItem(this.TokenKey);
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmail(email: string) {
    const url = `${this.baseUrl}account/emailexists?email=${email}`;

    return this.http.get(url);
  }

  getUserAddress() {
    const url = `${this.baseUrl}account/address`;

    return this.http.get<IAddress>(url);
  }

  updateUserAddress(address: IAddress) {
    const url = `${this.baseUrl}account/address`;

    return this.http.put<IAddress>(url, address);
  }
}
