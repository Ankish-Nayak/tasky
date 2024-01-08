import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleSearchService {
  private _titleSearchSource = new BehaviorSubject<string>('');
  titleSearchMessage$ = this._titleSearchSource.asObservable();
  constructor() {}
  get titleSearch() {
    return this._titleSearchSource;
  }
  updateTitleSearch(title: string) {
    this._titleSearchSource.next(title);
  }
  resetTitleSearch() {
    this._titleSearchSource.next('');
  }
}
