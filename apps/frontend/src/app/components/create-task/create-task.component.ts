import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { IEmployee } from '../../models/employee';
import { EmployeesService } from '../../services/employees/employees.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TasksService } from '../../services/tasks/tasks.service';
import { Router } from '@angular/router';

@Injectable()
@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent implements OnInit {
  employees: IEmployee[] = [];
  title: string = '';
  titleHelperMessage: string = 'Provide title to task.';
  createEmpoyeeForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    assignTo: new FormControl('Assign Value'),
  });
  constructor(
    private http: HttpClient,
    private router: Router,
    private employeesService: EmployeesService,
    private tasksService: TasksService,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.getEmployees();
  }
  getEmployees() {
    this.employeesService.getEmployees().subscribe((res) => {
      this.employees = res.employees;
      console.log(res);
    });
  }
  createEmployee() {
    console.log(this.createEmpoyeeForm.value);
    const { title, description, assignTo } = this.createEmpoyeeForm.value;
    this.tasksService
      .createTask(title ?? '', description ?? '', assignTo ?? '')
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
  isTitleTaken(title: string) {
    if (title !== 'undefined' && title.length > 0) {
      this.tasksService.isTaskTitleTaken(title).subscribe((res) => {
        if (res.titleTaken) {
          this.titleHelperMessage = 'Titls is Taken.';
        } else {
          this.titleHelperMessage = 'Provide title to task.';
        }
      });
    }
  }
}
