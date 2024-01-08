import { CommonModule } from '@angular/common';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import humanReadableDate from '../../../helpers/HumanReadableDate';
import { ITask } from '../../../models/task';
import { AuthService } from '../../../services/auth/auth.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { UserProfileService } from '../../../services/userProfile/user-profile.service';
import { UsersService } from '../../../services/users/users.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Injectable()
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, UserDialogComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  @Input() task: ITask;
  answer: string = '';
  answers: string[] = [];
  role: 'admin' | 'employee' = 'admin';
  message: 'start' | 'done' | 'approve' | 'approved' | 'progress' = 'approved';
  constructor(
    private authService: AuthService,
    private taskService: TasksService,
    private router: Router,
    private usersService: UsersService,
    private userProfileService: UserProfileService,
    public bsModalRef: BsModalRef,
  ) {
    this.task = {} as ITask;
  }
  ngOnInit(): void {
    console.log(this.role);
    this.task.createdAt = humanReadableDate(this.task.createdAt);
    if (typeof this.task.updatedAt !== 'undefined') {
      this.task.updatedAt = humanReadableDate(this.task.updatedAt);
    }
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

  respond(event: MouseEvent, answer: string) {
    console.log('hit');
    event.preventDefault();
    this.answer = answer;
    this.bsModalRef.hide();
  }
  openProfile(event: MouseEvent) {
    event.preventDefault();

    const userId =
      this.role === 'admin'
        ? this.task.assignedTo._id
        : this.task.assignedBy._id;
    this.usersService.getUserById(userId).subscribe((res) => {
      console.log('opening profile', res);

      this.userProfileService
        .openProfile(res.username, res.firstname, res.lastname)
        .subscribe(() => {
          console.log('res', res);
        });
    });
  }
  isUpdatedAt() {
    return typeof this.task.updatedAt !== 'undefined';
  }
  navigateToUpdateTask() {
    this.router.navigate(['/updateTask', this.task._id]);
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

  handleTask(event: MouseEvent) {
    event.preventDefault();
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
        this.task.status = 'progress';
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
        this.message = 'done';
        this.task.status = 'done';
      });
    } else {
      console.log('error');
    }
  }
}
