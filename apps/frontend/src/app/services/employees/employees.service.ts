import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { IEmployee, EmployeeList } from '../../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  baseUrl = `${environment.apiUrl}/employees`;
  constructor(private http: HttpClient) {}

  getEmployees() {
    return this.http.get<EmployeeList>(`${this.baseUrl}/`, {
      withCredentials: true,
    });
  }
  getEmplooyeeById(employeeId: string) {
    return this.http.get<{ employee: IEmployee }>(
      `${this.baseUrl}/${employeeId}`,
      {
        withCredentials: true,
      },
    );
  }
  getEmployeebyUsernamePrefix(prefix: string) {
    const regex = `^${prefix}`;

    return this.http.get<EmployeeList>(`${this.baseUrl}/username/${regex}`, {
      withCredentials: true,
    });
  }
}
