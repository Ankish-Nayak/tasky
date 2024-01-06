import { CommonModule, Location } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AuthService } from '../../services/auth/auth.service';
import { RootService } from '../../services/root/root.service';

import { adminNavLinks, employeeNavLinks } from '../../helpers/navLinks';

import {
  adminAllowedRoutes,
  employeeAllowedRoutes,
} from '../../helpers/allowedRoutes';
import { capitalizeFirstLetter } from '../../helpers/captitalize';
import { IEmployee } from '../../models/employee';
import { INavLink } from '../../models/navLink';
import { IFilter, ISort } from '../../models/task';
import { EmployeesService } from '../../services/employees/employees.service';
import { FiltersService } from '../../services/tasks/filters/filters.service';
import { SortsService } from '../../services/tasks/sorts/sorts.service';
import { TasksService } from '../../services/tasks/tasks.service';

// FIX: Search by with autosuggestions.
// TODO: add modal of profile pic when clicked on card text link.
// TODO: add search bar for searching employees whlile assingning task.
// TODO: make admin to assign particular task to multiple employees.
// TODO: make sortBy work from backend to frontend.

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
  adminNavLinks: INavLink[] = adminNavLinks;
  employeeNavLinks: INavLink[] = employeeNavLinks;
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
  currentPath: string = '';
  private _selectedSortBy: ISort = 'recent';
  constructor(
    private router: Router,
    private authService: AuthService,
    private rootService: RootService,
    private filtersService: FiltersService,
    private employeeService: EmployeesService,
    private location: Location,
    private sortByService: SortsService,
    private tasks: TasksService,
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
    this.updateFilterBy(filter);
  }
  ngOnInit() {
    this.router.events.subscribe((res) => {
      if (res instanceof NavigationEnd) {
        if (
          this.role === 'admin' &&
          !adminAllowedRoutes.includes(res.url.split('/').reverse()[0])
        ) {
          this.router.navigate(['']);
        } else if (
          this.role === 'employee' &&
          !employeeAllowedRoutes.includes(res.url.split('/').reverse()[0])
        ) {
          this.router.navigate(['']);
        }
      }
    });
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
    this.sortByService.sortMessage$.subscribe((res) => {
      this._selectedSortBy = res;
      this.tasks.getTasks(res);
    });
  }
  get selectedSortBy(): string {
    return capitalizeFirstLetter(this._selectedSortBy);
  }
  set selectedSortBy(updatedSortBy: ISort) {
    this._selectedSortBy = updatedSortBy;
  }
  roleBasedFilterBy(role: 'admin' | 'employee') {
    if (role === 'admin') {
      this.filters = ['approve', 'approved', 'all'];
    } else {
      this.filters = ['pending', 'done', 'progress', 'approved', 'all'];
    }
  }
  updateSortBy(sortBy: ISort) {
    this.sortByService.updateFilter(sortBy);
  }
  updateFilterBy(selectedFilter: IFilter) {
    this.filtersService.updateFilter(selectedFilter);
  }
  async logout() {
    this.router.navigate(['']);
    this.filtersService.resetFilter();
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
