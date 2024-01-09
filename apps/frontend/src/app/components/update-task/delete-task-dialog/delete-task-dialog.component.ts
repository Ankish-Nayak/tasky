import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-task-dialog',
  standalone: true,
  imports: [ModalModule, CommonModule],
  templateUrl: './delete-task-dialog.component.html',
  styleUrl: './delete-task-dialog.component.css',
})
export class DeleteTaskDialogComponent {
  constructor(private BsModalRef: BsModalRef) {}
  delete() {}
}
