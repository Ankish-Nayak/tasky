import { Injectable, Renderer2 } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, ObservableLike } from 'rxjs';
import { ProfileComponent } from '../../components/auth/profile/profile.component';
import { UserDialogComponent } from '../../components/tasks/task/user-dialog/user-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  bsModalRef: BsModalRef = {} as BsModalRef;

  constructor(private bsModalService: BsModalService) {}
  openProfile(
    username: string,
    firstname: string,
    lastname: string,
  ): Observable<string> {
    const initialState = {
      username,
      firstname,
      lastname,
    };

    this.bsModalRef = this.bsModalService.show(UserDialogComponent, {
      initialState,
    });

    return new Observable<string>(this.getConfirmSubscriber());
  }

  private getConfirmSubscriber() {
    return (observer: any) => {
      const subscription = this.bsModalService.onHidden.subscribe(
        (reason: string) => {
          observer.next(this.bsModalRef.content.answer);
          observer.complete();
        },
      );
      return {
        unsubscribe() {
          subscription.unsubscribe();
        },
      };
    };
  }
}
