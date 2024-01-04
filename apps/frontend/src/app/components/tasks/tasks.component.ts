import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { TasksService } from '../../services/tasks/tasks.service';
import { ITask } from '../../models/task';

export const priority = () => {};
const statusOrder = ['pending', 'progress', 'done', 'approved'];

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  tasks: ITask[] = [];
  constructor(private tasksService: TasksService) {}
  ngOnInit(): void {
    this.tasksService.getTasks();
    this.tasksService.tasksSource$.subscribe((res) => {
      this.tasks = res;
      console.log(res);
    });
    this.tasks.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    );
  }
}
