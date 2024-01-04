import { Routes } from '@angular/router';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'createTask',
    component: CreateTaskComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
