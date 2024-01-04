import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RootService } from '../../../services/root/root.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // @Output() updatePageRender = new EventEmitter();

  loginFrom = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private authService: AuthService,
    private rootService: RootService,
  ) {}

  setPageRender() {
    this.rootService.setSignupLoginPageRender('signup');
    // this.updatePageRender.emit('signup');
  }
  login() {
    const { username, password } = this.loginFrom.value;
    console.log(username, password);
    this.authService.login(username ?? '', password ?? '');
  }
}
