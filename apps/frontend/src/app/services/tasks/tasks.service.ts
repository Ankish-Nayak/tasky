import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IFilter, ISort, ITask } from '../../models/task';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { IStatus } from 'types';
import { oldestFirst, recentFirst } from '../../helpers/sortTasksByRecentFirst';
import { FiltersService } from './filters/filters.service';
import { SortsService } from './sorts/sorts.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService implements OnInit {
  private baseUrl = `${environment.apiUrl}/tasks`;
  private _tasks = new Subject<ITask[]>();
  tasksSource$ = this._tasks.asObservable();

  constructor(
    private http: HttpClient,
    private filtersService: FiltersService,
    private sortByService: SortsService,
  ) {}

  createTask(title: string, description: string, assignedTo: string) {
    return this.http.post(
      `${this.baseUrl}/`,
      {
        title,
        description,
        assignedTo,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
  ngOnInit(): void {
    this.sortByService.sortMessage$.subscribe((res) => {});
  }
  sortTasks(tasks: ITask[]) {
    this._tasks.next(tasks);
  }
  updateTask(title: string, description: string) {
    return this.http.put(
      `${this.baseUrl}/`,
      {
        title,
        description,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  getTasksByTaskStatus(taskStatus: IStatus, sorts?: ISort) {
    this.http
      .get<{ tasks: ITask[] }>(`${this.baseUrl}/?filterBy=${taskStatus}`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
        if (typeof sorts === 'undefined' || sorts === 'recent') {
          res.tasks.sort(recentFirst);
        } else {
          res.tasks.sort(oldestFirst);
        }
        this._tasks.next(res.tasks);
      });
  }

  getTasks(sorts?: ISort, filterBy?: IFilter) {
    const filteringStatus: IStatus | 'all' = 'all';
    this.http
      .get<{ tasks: ITask[] }>(`${this.baseUrl}/`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
        if (typeof sorts === 'undefined' || sorts === 'recent') {
          res.tasks.sort(recentFirst);
        } else {
          res.tasks.sort(oldestFirst);
        }
        if (filteringStatus === 'all') {
          this._tasks.next(res.tasks);
        } else {
          this._tasks.next(
            res.tasks.filter((task) => task.status === filteringStatus),
          );
        }
      });
  }

  getTaskByUsername(username: string) {
    this.http
      .get<{ tasks: ITask[] }>(`${this.baseUrl}/?username=${username}`, {
        withCredentials: true,
      })
      .subscribe((res) => {
        console.log(res);
        this._tasks.next(res.tasks);
      });
  }

  isTaskTitleTaken(title: string) {
    return this.http.post<{ titleTaken: boolean }>(
      `${this.baseUrl}/title-taken`,
      {
        title,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
  markAsApproved(taskId: string) {
    return this.http.put<{ id: string }>(
      `${this.baseUrl}/${taskId}/mark-as-approved`,
      {},
      {
        withCredentials: true,
      },
    );
  }
  markAsDone(taskId: string) {
    return this.http.put<{ id: string }>(
      `${this.baseUrl}/${taskId}/mark-as-done`,
      {},
      {
        withCredentials: true,
      },
    );
  }
  markAsProgress(taskId: string) {
    return this.http.put<{ id: string }>(
      `${this.baseUrl}/${taskId}/mark-as-progress`,
      {},
      {
        withCredentials: true,
      },
    );
  }
  getTask(taskId: string) {
    return this.http.get<ITask>(`${this.baseUrl}/${taskId}`, {
      withCredentials: true,
    });
  }
  deleteTask(taskId: string) {
    return this.http.delete<ITask>(`${this.baseUrl}/${taskId}`, {
      withCredentials: true,
    });
  }
}
