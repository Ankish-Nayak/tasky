import {
  ChangeDetectorRef,
  Component,
  InjectFlags,
  Injectable,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { CommonModule } from '@angular/common';

@Injectable()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  pageRender: 'signup' | 'login' = 'login';
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }
  setPageRender() {
    if (this.pageRender === 'signup') {
      this.pageRender = 'login';
    } else {
      this.pageRender = 'signup';
    }
    console.log('changed', this.pageRender);
    this.cdr.detectChanges();
  }
}
