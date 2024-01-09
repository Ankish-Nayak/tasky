import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { DeleteTaskService } from '../service/delete-task.service';

@Component({
  selector: 'app-delete-task-dialog',
  standalone: true,
  imports: [ModalModule, CommonModule],
  templateUrl: './delete-task-dialog.component.html',
  styleUrl: './delete-task-dialog.component.css',
})
export class DeleteTaskDialogComponent {
  confirmation: boolean = false;
  constructor(
    public bsModalRef: BsModalRef,
    private deleteTask: DeleteTaskService,
  ) {}
  delete() {
    console.log('delete task');
    this.confirmation = true;
    this.deleteTask.bsModalRef.hide();
  }
  cancel() {
    console.log('canceled');
    this.confirmation = false;
    this.bsModalRef.hide();
  }
  close() {
    this.bsModalRef.hide();
  }
}
