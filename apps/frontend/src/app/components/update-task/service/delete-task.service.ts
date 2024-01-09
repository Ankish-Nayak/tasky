import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DeleteTaskService {
  bsModalRef: BsModalRef = {} as BsModalRef;

  constructor(private bsModalService: BsModalService) {}
  openDialog() {
    this.bsModalRef = this.bsModalService.show(DeleteTaskDialogComponent);
  }
}
