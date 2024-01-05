import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IEmployee } from '../../models/employee';
import { EmployeesService } from '../../services/employees/employees.service';
import { TasksService } from '../../services/tasks/tasks.service';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css',
})
export class UpdateTaskComponent {
  employees: IEmployee[] = [];
  title: string = '';
  titleHelperMessage: string = 'Provide title to task.';
  buttonDisabled: boolean = true;
  updateTaskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });
  constructor(
    private router: Router,
    private employeesService: EmployeesService,
    private tasksService: TasksService,
  ) {}
  ngOnInit(): void {
    this.getEmployees();
    this.updateTaskForm.valueChanges.subscribe((value) => {
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
  updateTask() {
    console.log(this.updateTaskForm.value);
    const { title, description } = this.updateTaskForm.value;
    this.tasksService
      .updateTask(title ?? '', description ?? '')
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
