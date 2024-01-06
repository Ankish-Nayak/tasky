import { Injectable } from '@angular/core';
import { ISort } from '../../../models/task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortsService {
  private _sortSource = new BehaviorSubject<ISort>('recent');
  sortMessage$ = this._sortSource.asObservable();
  constructor() {}
  get filter() {
    return this._sortSource.value;
  }
  updateFilter(updatedFilter: ISort) {
    this._sortSource.next(updatedFilter);
  }
  resetSortBy() {
    this._sortSource.next('recent');
  }
}
