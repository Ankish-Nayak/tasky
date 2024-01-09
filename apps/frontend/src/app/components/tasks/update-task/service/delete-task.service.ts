import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteTaskService {
  bsModalRef: BsModalRef = {} as BsModalRef;

  constructor(private bsModalService: BsModalService) {}
  openDialog(confirmation: boolean) {
    const initialState = { confirmation };
    this.bsModalRef = this.bsModalService.show(DeleteTaskDialogComponent, {
      initialState,
    });
    return new Observable<boolean>(this.getConfirmSubscriber());
  }
  private getConfirmSubscriber() {
    return (observer: any) => {
      const subscription = this.bsModalService.onHidden.subscribe(() => {
        // make sure to update this every time for different component
        observer.next(this.bsModalRef.content.confirmation);
        observer.complete();
      });
      return {
        unsubscribe() {
          subscription.unsubscribe();
        },
      };
    };
  }
}
