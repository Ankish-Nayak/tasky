import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IFilter } from '../../../models/task';
@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private _filterSource = new BehaviorSubject<IFilter>(null);
  filterMessage$ = this._filterSource.asObservable();
  constructor() {}
  get filter() {
    return this._filterSource.value;
  }
  set filter(updatedFilter: IFilter) {
    this._filterSource.next(updatedFilter);
  }
  updateFilter(updatedFilter: IFilter) {
    this._filterSource.next(updatedFilter);
  }
}
