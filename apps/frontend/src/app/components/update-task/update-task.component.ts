import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee } from '../../models/employee';
import { EmployeesService } from '../../services/employees/employees.service';
import { TasksService } from '../../services/tasks/tasks.service';
import { ITask } from '../../models/task';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css',
})
export class UpdateTaskComponent {
  task: ITask;
  employees: IEmployee[] = [];
  title: string = '';
  taskId: string = '';
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
    private route: ActivatedRoute,
  ) {
    this.task = {} as ITask;
  }
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
    this.updateTaskForm.patchValue({
      title: this.task.title,
      description: this.task.description,
    });
    this.initTask();
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
      .updateTask(this.taskId, title ?? '', description ?? '')
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
  isTitleTaken(title: string) {
    if (title !== 'undefined' && title.length > 0) {
      this.tasksService
        .isTaskTitleTakenUpdate(title, this.taskId)
        .subscribe((res) => {
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
  deleteTask() {
    this.tasksService.deleteTask(this.taskId).subscribe((res) => {
      console.log(res);
      this.router.navigate(['']);
    });
  }
  resetTask() {
    this.initTask();
  }
  initTask() {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (taskId !== null) {
      this.taskId = taskId;
      this.tasksService.getTask(taskId).subscribe((res) => {
        console.log(res);
        this.updateTaskForm.patchValue(res.task);
      });
    }
  }
}
