import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AuthService } from '../../services/auth/auth.service';
import { RootService } from '../../services/root/root.service';

import { IFilter } from '../../models/task';
import { FiltersService } from '../../services/tasks/filters/filters.service';

@Injectable()
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TooltipModule, BsDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: {
    value: boolean;
    isLoading: boolean;
  } = {
    value: false,
    isLoading: true,
  };

  role: 'admin' | 'employee' = 'admin';
  filters: IFilter[] = [];
  selectedFilter: IFilter = null;
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private router: Router,
    private authService: AuthService,
    private rootService: RootService,
    private filtersService: FiltersService,
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
    this.isLoggedIn = {
      isLoading: false,
      value: this.authService.getIsLoggedIn(),
    };
    this.authService.userMessage$.subscribe((res) => {
      this.roleBasedFilterBy(res.role);
      console.log(res);
      this.role = res.role;
    });
    this.filtersService.filterMessage$.subscribe((res) => {
      this.selectedFilter = res;
    });
    this.authService.isLoggedInMessage$.subscribe(
      (message) => {
        if (message) {
          this.isLoggedIn = {
            isLoading: false,
            value: true,
          };
        } else {
          this.isLoggedIn = {
            isLoading: false,
            value: false,
          };
        }
        console.log('navbar', this.isLoggedIn);
      },
      () => {
        this.isLoggedIn = {
          isLoading: false,
          value: false,
        };
      },
      () => {
        this.isLoggedIn.isLoading = false;
      },
    );
  }
  roleBasedFilterBy(role: 'admin' | 'employee') {
    if (role === 'admin') {
      console.log('dfadfd');
      this.filters = ['approve', 'approved'];
    } else {
      this.filters = ['pending', 'done', 'progress', 'approved'];
    }
  }
  updateFilterBy(selectedFilter: IFilter) {
    this.filtersService.updateFilter(selectedFilter);
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
