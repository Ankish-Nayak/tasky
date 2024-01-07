import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth/auth.service';
import { FiltersService } from './services/tasks/filters/filters.service';
import { SortsService } from './services/tasks/sorts/sorts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    HttpClientModule,
    HomeComponent,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'tasky';
  currentPath: string = '';
  constructor(
    private authService: AuthService,
    private filterBy: FiltersService,
    private sortBy: SortsService,
  ) {}
  ngOnInit(): void {
    this.authService.me();
    this.authService.isLoggedInMessage$.subscribe((res) => {
      if (!res) {
        this.filterBy.resetFilter();
        this.sortBy.resetSortBy();
      }
    });
  }
}
