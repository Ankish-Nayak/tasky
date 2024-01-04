import { CommonModule } from '@angular/common';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ITask } from '../../../models/task';
import humanReadableDate from '../../../helpers/HumanReadableDate';
import { AuthService } from '../../../services/auth/auth.service';
import { TasksService } from '../../../services/tasks/tasks.service';

@Injectable()
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  @Input() task: ITask;
  role: 'admin' | 'employee' = 'admin';
  message: 'start' | 'done' | 'approve' | 'approved' = 'approved';
  constructor(
    private authService: AuthService,
    private taskService: TasksService,
  ) {
    this.task = {} as ITask;
  }
  ngOnInit(): void {
    console.log(this.role);
    this.task.createdAt = humanReadableDate(this.task.createdAt);
    this.authService.userMessage$.subscribe((message) => {
      this.role = message.role;
      console.log('task', this.role);
    });
  }
  isAdmin(): boolean {
    return this.role === 'admin';
  }
  getMessage(): string {
    if (this.role === 'admin') {
      if (this.task.status === 'pending') {
        this.message = 'approve';
      } else {
        this.message = 'approved';
      }
    } else {
      if (this.task.status === 'pending') {
        this.message = 'start';
      } else if (this.task.status === 'progress') {
        this.message = 'done';
      }
    }
    return this.message;
  }

  handleTask() {
    switch (this.message) {
      case 'start': {
        this.start();
        break;
      }
      case 'done': {
        this.done();
        break;
      }
      case 'approve': {
        this.approve();
        break;
      }
      default: {
        console.log(this.message);
      }
    }
  }

  start() {
    if (this.role === 'employee') {
      this.taskService.markAsProgress(this.task._id);
    }
  }
  approve() {
    if (this.role === 'admin') {
      this.taskService.markAsApproved(this.task._id);
    }
  }
  done() {
    if (this.role === 'employee') {
      this.taskService.markAsDone(this.task._id);
    } else {
      console.log('error');
    }
  }
}
