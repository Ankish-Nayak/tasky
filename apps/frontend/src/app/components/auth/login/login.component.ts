import { Component, Input } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input() setPageRender: () => void;
  loginFrom = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private authService: AuthService) {
    this.setPageRender = () => {};
  }

  haveAccount() {
    if (this.setPageRender) {
      this.setPageRender();
    }
  }
  login() {
    const { username, password } = this.loginFrom.value;
    console.log(username, password);
    this.authService.login(username ?? '', password ?? '');
  }
}
