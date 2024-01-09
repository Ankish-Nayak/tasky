import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateProfileService {
  bsModalRef: BsModalRef = {} as BsModalRef;
  constructor(private bsModalService: BsModalService) {}
  openUpdateProfile(username: string, firstname: string, lastname: string) {
    const initialState = {
      username,
      firstname,
      lastname,
    };

    this.bsModalRef = this.bsModalService.show(UpdateProfileComponent, {
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
