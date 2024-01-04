import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  private _signupLoginPageRender = new Subject<'login' | 'signup'>();
  signupLoginPageRenderMessage$ = this._signupLoginPageRender.asObservable();

  constructor() {
    this._signupLoginPageRender.next('login');
  }

  setSignupLoginPageRender(updatedValue: 'login' | 'signup') {
    this._signupLoginPageRender.next(updatedValue);
  }
}
