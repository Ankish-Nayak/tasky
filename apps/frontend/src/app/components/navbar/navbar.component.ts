import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Injectable()
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  async ngOnInit() {
    this.isLoggedIn = await this.LoggedIn();
  }
  async LoggedIn() {
    return await this.authService.me();
  }
  async logout() {
    this.isLoggedIn = await this.authService.logout();
  }
  open() {
    this.authService.open();
  }
  onSubmit() {
    const { username, password } = this.loginForm.value;
    console.log(username, password);
    this.authService.login(username || '', password || '');
  }
}
