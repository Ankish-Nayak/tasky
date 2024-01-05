import { CommonModule } from '@angular/common';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ITask } from '../../../models/task';
import humanReadableDate from '../../../helpers/HumanReadableDate';
import { AuthService } from '../../../services/auth/auth.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { Router } from '@angular/router';

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
    private router: Router,
  ) {
    this.task = {} as ITask;
  }
  ngOnInit(): void {
    console.log(this.role);
    this.task.createdAt = humanReadableDate(this.task.createdAt);
    this.authService.userMessage$.subscribe((message) => {
      const { role } = message;
      this.role = message.role;
      if (role === 'admin') {
        if (this.task.status === 'done') {
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
    });
  }
  navigateToUpdateTask() {
    this.router.navigate(['/updateTask']);
  }
  getAdminCardText() {
    return this.task.assignedTo.firstname;
  }
  getEmployeeCardText() {
    return this.task.assignedBy.firstname;
  }
  getCardText() {
    return this.role === 'admin'
      ? this.getAdminCardText()
      : this.getEmployeeCardText();
  }
  isAdmin(): boolean {
    return this.role === 'admin';
  }
  getMessage(): string {
    return this.message;
  }

  handleTask() {
    console.log(this.message, this.role);
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
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'progress':
        return 'progress';
      case 'done':
        return 'done';
      case 'approved':
        return 'approved';
      default:
        return '';
    }
  }
  start() {
    if (this.role === 'employee') {
      this.taskService.markAsProgress(this.task._id).subscribe((res) => {
        this.message = 'done';
        this.task.status = 'done';
        console.log(res);
      });
    }
  }
  approve() {
    if (this.role === 'admin') {
      this.taskService.markAsApproved(this.task._id).subscribe(() => {
        this.message = 'approved';
        this.task.status = 'approved';
      });
    }
  }
  done() {
    if (this.role === 'employee') {
      this.taskService.markAsDone(this.task._id).subscribe(() => {
        this.message = 'approve';
        this.task.status = 'done';
      });
    } else {
      console.log('error');
    }
  }
}
