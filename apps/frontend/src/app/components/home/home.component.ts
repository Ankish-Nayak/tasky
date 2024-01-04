import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RootService } from '../../services/root/root.service';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { TasksComponent } from '../tasks/tasks.component';

@Injectable()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, CommonModule, TasksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  pageRender: 'signup' | 'login' = 'login';
  constructor(
    private authService: AuthService,
    private rootService: RootService,
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedInMessage$.subscribe((message) => {
      this.isLoggedIn = message;
    });
    this.rootService.signupLoginPageRenderMessage$.subscribe((message) => {
      this.pageRender = message;
    });
  }
}
