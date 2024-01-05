import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { IUser, IUsers } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}
  getUserById(userId: string) {
    return this.http.get<IUser>(`${this.baseUrl}/${userId}`, {
      withCredentials: true,
    });
  }
  getUsers() {
    return this.http.get<IUsers>(`${this.baseUrl}/`, {
      withCredentials: true,
    });
  }
}
