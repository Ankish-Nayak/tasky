import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITask } from '../../models/task';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../config/config';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private baseUrl = `${environment.apiUrl}/tasks`;
  private _tasks = new Subject<ITask[]>();
  tasksSource$ = this._tasks.asObservable();

  constructor(private http: HttpClient) {}

  getTasks() {
    this.http
      .get<{ tasks: ITask[] }>(`${this.baseUrl}/`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
        this._tasks.next(res.tasks);
      });
  }
  markAsApproved(taskId: string) {
    this.http
      .put<{ id: string }>(
        `${this.baseUrl}/${taskId}/mask-as-approved`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe((res) => {
        console.log(res.id);
      });
  }
  markAsDone(taskId: string) {
    this.http
      .put<{ id: string }>(
        `${this.baseUrl}/${taskId}/mask-as-done`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe((res) => {
        console.log(res.id);
      });
  }
  markAsProgress(taskId: string) {
    this.http
      .put<{ id: string }>(
        `${this.baseUrl}/${taskId}/mask-as-progress`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe((res) => {
        console.log(res.id);
      });
  }
  getTask(taskId: string) {
    this.http
      .get<ITask>(`${this.baseUrl}/${taskId}`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
  deleteTask(taskId: string) {
    this.http
      .delete<ITask>(`${this.baseUrl}/${taskId}`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
