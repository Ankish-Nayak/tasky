import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IEmployee } from '../../models/employee';
import { EmployeesService } from '../../services/employees/employees.service';
import { TasksService } from '../../services/tasks/tasks.service';

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
  buttonDisabled: boolean = true;
  createTaskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    assignTo: new FormControl('Assign Value'),
  });
  constructor(
    private router: Router,
    private employeesService: EmployeesService,
    private tasksService: TasksService,
  ) {}
  ngOnInit(): void {
    this.getEmployees();
    this.createTaskForm.valueChanges.subscribe((value) => {
      // TODO: add proper zod validation
      if (Object.values(value).some((prop) => prop === null)) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }
    });
  }
  getEmployees() {
    this.employeesService.getEmployees().subscribe((res) => {
      this.employees = res.employees;
      console.log(res);
    });
  }
  createTask() {
    console.log(this.createTaskForm.value);
    const { title, description, assignTo } = this.createTaskForm.value;
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
          this.buttonDisabled = true;
        } else {
          this.titleHelperMessage = 'Provide title to task.';
          this.buttonDisabled = false;
        }
      });
    }
  }
}
