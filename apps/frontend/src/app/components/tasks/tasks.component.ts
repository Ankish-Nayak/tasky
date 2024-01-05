import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ITask } from '../../models/task';
import { FiltersService } from '../../services/tasks/filters/filters.service';
import { TasksService } from '../../services/tasks/tasks.service';
import { TaskComponent } from './task/task.component';

export const priority = () => {};
const statusOrder = ['pending', 'progress', 'done', 'approved'];

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskComponent, ModalModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  modalRef?: BsModalRef;
  tasks: ITask[] = [];
  filteredTask: ITask[] = [];
  constructor(
    private tasksService: TasksService,
    private filtersService: FiltersService,
    private modalService: BsModalService,
  ) {}
  ngOnInit(): void {
    this.tasksService.getTasks();
    this.tasksService.tasksSource$.subscribe((res) => {
      this.tasks = res;
      this.filteredTask = this.tasks;
      console.log(res);
    });
    this.tasks.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    );
    this.filtersService.filterMessage$.subscribe((res) => {
      if (res === 'all' || res === null) {
        this.filteredTask = this.tasks.filter((task) => task.status.length > 0);
      } else if (res === 'approve') {
        this.filteredTask = this.tasks.filter((task) => task.status === 'done');
      } else {
        this.filteredTask = this.tasks.filter((task) => task.status === res);
      }
      console.log(this.tasks, this.filteredTask);
    });
  }
  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }
}
