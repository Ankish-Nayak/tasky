import { INavLink } from '../models/navLink';

export const adminNavLinks: INavLink[] = [
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

export const employeeNavLinks: INavLink[] = [
  {
    navigateTo: '',
    name: 'Tasks',
    class: 'nav-link',
    isActive: false,
  },
];
