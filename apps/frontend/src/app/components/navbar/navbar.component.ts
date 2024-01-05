import { CommonModule, Location } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AuthService } from '../../services/auth/auth.service';
import { RootService } from '../../services/root/root.service';

import { IFilter } from '../../models/task';
import { FiltersService } from '../../services/tasks/filters/filters.service';
import { EmployeesService } from '../../services/employees/employees.service';
import { IEmployee } from '../../models/employee';
import { INavLink } from '../../models/navLink';

// FIX: filterBy based on status.
// FIX: Search by with autosuggestions.
// TODO: add modal of profile pic when clicked on card text link.
// TODO: add search bar for searching employees whlile assingning task.
// TODO: make admin to assign particular task to multiple employees.
// TODO: update task method.

@Injectable()
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    BsDropdownModule,
    FormsModule,
    TypeaheadModule,
  ],
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

  navLinks: INavLink[] = [];
  adminNavLinks: INavLink[] = [
    {
      navigateTo: '/createTask',
      name: 'Create Task',
      class: 'nav-link',
      isActive: false,
    },
    {
      navigateTo: '',
      name: 'Tasks',
      class: 'nav-link',
      isActive: false,
    },
  ];

  employeeNavLinks: INavLink[] = [
    {
      navigateTo: '',
      name: 'Tasks',
      class: 'nav-link',
      isActive: false,
    },
  ];
  role: 'admin' | 'employee' = 'admin';
  filters: IFilter[] = [];
  selectedFilter: IFilter = null;
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  username: string = '';
  employeeList: IEmployee[] = [
    {
      _id: '6592a886388d406d96ba59b6',
      firstname: 'ankish',
      lastname: 'nayak',
      username: 'ankish@gmail.com',
    },
  ];
  constructor(
    private router: Router,
    private authService: AuthService,
    private rootService: RootService,
    private filtersService: FiltersService,
    private employeeService: EmployeesService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}
  printTitle(title: string) {
    console.log(title);
    if (title.length === 0) {
      this.employeeList = [];
      return;
    }
    this.employeeService.getEmployeebyUsernamePrefix(title).subscribe((res) => {
      console.log(res.employees);
      this.employeeList = res.employees;
    });
  }
  isLanding() {
    return this.location.path() === '';
  }
  isAdmin() {
    return this.role === 'admin';
  }
  handleNavigateTo(event: MouseEvent, name: string) {
    event.preventDefault();
    this.navLinks.forEach((navLink) => (navLink.isActive = false));
    const x = this.navLinks.findIndex((navlink) => navlink.name === name);
    if (x >= 0) {
      this.navLinks[x].isActive = true;
      this.router.navigate([this.navLinks[x].navigateTo]);
    }
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
  handleFilterBy(e: MouseEvent, filter: IFilter) {
    e.preventDefault();
    console.log(filter);
    if (filter === 'all') {
    } else {
      this.updateFilterBy(filter);
    }
  }
  ngOnInit() {
    console.log(this.location);

    console.log(this.route);
    //
    // console.log(this.route._routerState.url);
    this.isLoggedIn = {
      isLoading: false,
      value: this.authService.getIsLoggedIn(),
    };
    this.authService.userMessage$.subscribe((res) => {
      this.roleBasedFilterBy(res.role);
      if (res.role === 'admin') {
        this.navLinks = this.adminNavLinks;
      } else {
        this.navLinks = this.employeeNavLinks;
      }
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
      this.filters = ['approve', 'approved', 'all'];
    } else {
      this.filters = ['pending', 'done', 'progress', 'approved', 'all'];
    }
  }
  updateFilterBy(selectedFilter: IFilter) {
    this.filtersService.updateFilter(selectedFilter);
  }
  async logout() {
    this.router.navigate(['']);
    this.authService.logout();
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
