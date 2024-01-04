import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RootService } from '../../services/root/root.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@Injectable()
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TooltipModule, BsDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: 'admin' | 'employee' = 'admin';
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private router: Router,
    private authService: AuthService,
    private rootService: RootService,
  ) {}
  isAdmin() {
    return this.role === 'admin';
  }
  navigateToHome(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/']);
  }
  navigateToLogin(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
  navigateToRegister(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
  navigateToCreateTask(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/createTask']);
  }
  ngOnInit() {
    this.LoggedIn();
    this.authService.userMessage$.subscribe((res) => {
      this.role = res.role;
    });
    this.authService.isLoggedInMessage$.subscribe((message) => {
      if (message) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
      console.log('navbar', this.isLoggedIn);
    });
  }
  LoggedIn() {
    this.authService.me();
  }
  async logout() {
    this.authService.logout();
  }
  open() {
    this.authService.open();
  }
  onSubmit() {
    const { username, password } = this.loginForm.value;
    console.log(username, password);
    this.authService.login(username || '', password || '');
  }
  login() {
    console.log('clickeddfdfd');
    this.rootService.setSignupLoginPageRender('login');
  }
  signup() {
    this.rootService.setSignupLoginPageRender('signup');
  }
}
