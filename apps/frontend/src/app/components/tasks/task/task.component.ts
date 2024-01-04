import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ITask } from '../../../models/task';
import humanReadableDate from '../../../helpers/HumanReadableDate';
import { AuthService } from '../../../services/auth/auth.service';

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
  message: string = '';
  constructor(private authService: AuthService) {
    this.task = {} as ITask;
  }
  ngOnInit(): void {
    console.log(this.role);
    this.task.createdAt = humanReadableDate(this.task.createdAt);
    this.authService.userMessage?.subscribe((message) => {
      this.role = message.role;
      console.log('d', this.role);
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
}
