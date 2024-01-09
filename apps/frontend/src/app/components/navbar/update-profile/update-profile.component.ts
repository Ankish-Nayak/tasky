import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css',
})
export class UpdateProfileComponent implements OnInit {
  firstname: string = '';
  lastname: string = '';
  username: string = '';
  role: 'admin' | 'employee' = 'admin';
  buttonDisabled: boolean = false;

  updateProfileForm = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    username: new FormControl(),
  });
  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.updateProfileForm.valueChanges.subscribe((value) => {
      // TODO: add proper zod validation
      if (Object.values(value).some((prop) => prop === null)) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }
    });
    this.initTask();

    this.authService.userMessage$.subscribe((res) => {
      this.role = res.role;
    });
  }
  initTask() {
    const userId = this.authService.userSource.value.userId;
    if (userId !== null) {
      this.usersService.getUserById(userId).subscribe((res) => {
        this.updateProfileForm.patchValue(res);
      });
    }
  }

  updateProfile() {
    const { username, firstname, lastname } = this.updateProfileForm.value;
    this.usersService
      .updateProfile(username, firstname, lastname)
      .subscribe((_res) => {
        this.bsModalRef.hide();
      });
  }

  resetProfile() {
    this.initTask();
  }

  close() {
    this.bsModalRef.hide();
  }
  isAdmin() {
    return this.role === 'admin';
  }
  assignTask() {
    console.log('dfd');
    this.router.navigate(['/createTask']);
    this.bsModalRef.hide();
  }
}
