import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { IStatus } from 'types';
import { ITask } from '../../models/task';
import { FiltersService } from '../../services/tasks/filters/filters.service';
import { SortsService } from '../../services/tasks/sorts/sorts.service';
import { TasksService } from '../../services/tasks/tasks.service';
import { TaskComponent } from './task/task.component';
import { TitleSearchService } from '../../services/tasks/titles/title-search.service';

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
    private sortBy: SortsService,
    private titleSearch: TitleSearchService,
  ) {}
  ngOnInit(): void {
    this.tasksService.getTasks('all');
    this.tasksService.tasksSource$.subscribe((res) => {
      this.tasks = res;
      console.log(res);
    });
    this.tasks.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    );
    this.titleSearch.titleSearchMessage$.subscribe((res) => {
      this.tasksService.getTasks('all', this.sortBy.filter, res);
    });
    this.filtersService.filterMessage$.subscribe((res) => {
      if (res === 'all' || res === null) {
        this.tasksService.getTasks('all', this.sortBy.filter);
      } else if (res === 'approve') {
        this.tasksService.getTasks('done', this.sortBy.filter);
      } else {
        this.tasksService.getTasks(res, this.sortBy.filter);
      }
      console.log(this.tasks, this.filteredTask);
    });
    this.sortBy.sortMessage$.subscribe((res) => {
      const filter = this.filtersService.filter;
      let status: IStatus | 'all' = 'all';
      if (filter === 'approve') {
        status = 'done';
      } else {
        status = filter;
      }
      this.tasksService.getTasks(status, res);
    });
  }
  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }
}
