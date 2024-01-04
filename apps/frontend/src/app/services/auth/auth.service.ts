import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginParams, signupParams } from 'types';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;

  private isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {}

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  me(): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.http
        .get(`${this.baseUrl}/users/me`, {
          withCredentials: true,
        })
        .subscribe(
          () => {
            this.isLoggedIn = true;
            res(true);
          },
          () => {
            this.isLoggedIn = false;
            rej(false);
          },
        );
    });
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
      .put(`${this.baseUrl}/users/login`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.isLoggedIn = true;
        },
        () => {
          this.isLoggedIn = false;
        },
      );
  }

  logout() {
    return new Promise<boolean>((res, rej) => {
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
            res(true);
          },
          () => {
            this.isLoggedIn = false;
            res(true);
          },
        );
    });
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
      .post(`${this.baseUrl}/users/signup`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.isLoggedIn = true;
        },
        () => {
          this.isLoggedIn = false;
        },
      );
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
