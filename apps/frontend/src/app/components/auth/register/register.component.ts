import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { signupParams } from 'types';
import { AuthService } from '../../../services/auth/auth.service';
import { RootService } from '../../../services/root/root.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  signupForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(),
  });
  // @Output() updatePageRender = new EventEmitter();
  constructor(
    private authService: AuthService,
    private rootService: RootService,
  ) {}
  signup() {
    const { username, firstname, lastname, password, role } =
      this.signupForm.value;
    this.authService.signup(
      firstname ?? '',
      lastname ?? '',
      username ?? '',
      password ?? '',
      role ?? '',
    );
  }
  setPageRender() {
    this.rootService.setSignupLoginPageRender('login');
    // this.updatePageRender.emit('login');
  }
}
