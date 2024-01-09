import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginParams, signupParams, updateProfileParams } from 'types';
import { environment } from '../../../environments/environment.dev';
import { BehaviorSubject, Subject } from 'rxjs';
import { IUser } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;

  private isLoggedIn: boolean = false;

  private _userSource = new BehaviorSubject<{
    userId: string;
    role: 'admin' | 'employee';
    firstname: string;
  }>({
    userId: 'defaultUserId',
    role: 'employee',
    firstname: 'John',
  });

  userMessage$ = this._userSource.asObservable();

  private _isLoggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedInMessage$ = this._isLoggedInSource.asObservable();

  constructor(private http: HttpClient) {}

  get isLoggedInSource() {
    return this._isLoggedInSource.value;
  }
  get userSource() {
    return this._userSource;
  }
  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  me() {
    this.http
      .get<{ firstname: string; id: string; role: 'admin' | 'employee' }>(
        `${this.baseUrl}/users/me`,
        {
          withCredentials: true,
        },
      )
      .subscribe(
        (res) => {
          // this._userIdSource.next(res.id);
          this.isLoggedIn = true;
          this._userSource.next({
            userId: res.id,
            role: res.role,
            firstname: res.firstname,
          });
          this._isLoggedInSource.next(true);
          console.log('dd', res);
        },
        () => {
          this._isLoggedInSource.next(false);
          this.isLoggedIn = false;
        },
      );
  }

  async open() {
    this.http
      .get(`${this.baseUrl}/users/open`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  async login(username: string, password: string) {
    const data: loginParams = {
      username,
      password,
    };
    this.http
      .put<{ firstname: string; id: string; role: 'admin' | 'employee' }>(
        `${this.baseUrl}/users/login`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.isLoggedIn = true;
          this._isLoggedInSource.next(true);
          this._userSource.next({
            userId: res.id,
            role: res.role,
            firstname: res.firstname,
          });
        },
        () => {
          this.isLoggedIn = false;
          this._isLoggedInSource.next(false);
        },
      );
  }

  logout() {
    this.http
      .put(
        `${this.baseUrl}/users/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe(
        () => {
          this.isLoggedIn = false;
          this._isLoggedInSource.next(false);
        },
        () => {
          this.isLoggedIn = false;
          this._isLoggedInSource.next(false);
        },
      );
  }

  async signup(
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    role: 'employee' | 'admin',
  ) {
    const data: signupParams = {
      firstname,
      lastname,
      username,
      password,
      role,
    };
    this.http
      .post<{ firstname: string; id: string; role: 'admin' | 'employee' }>(
        `${this.baseUrl}/users/signup`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.isLoggedIn = true;
          this._isLoggedInSource.next(true);
        },
        () => {
          this.isLoggedIn = false;
          this._isLoggedInSource.next(false);
        },
      );
  }

  updateProfile(username: string, firstname: string, lastname: string) {
    const data: updateProfileParams = {
      username,
      firstname,
      lastname,
    };
    //FIXME: do valid zod validation.
    return this.http.put<{ user: IUser }>(`${this.baseUrl}/`, data, {
      withCredentials: true,
    });
  }

  async getProfile() {
    this.http
      .get(`${this.baseUrl}/`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  async getProfileById() {}
}
