import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css',
})
export class UpdateProfileComponent {
  firstname: string = '';
  lastname: string = '';
  username: string = '';
  role: 'admin' | 'employee' = 'admin';
  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private authService: AuthService,
  ) {}
  close() {
    this.bsModalRef.hide();
  }
  isAdmin() {
    return this.role === 'admin';
  }
  ngOnInit(): void {
    this.authService.userMessage$.subscribe((res) => {
      this.role = res.role;
    });
  }
  assignTask() {
    console.log('dfd');
    this.router.navigate(['/createTask']);
    this.bsModalRef.hide();
  }
}
