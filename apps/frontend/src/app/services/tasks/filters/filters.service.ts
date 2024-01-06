import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IFilter } from '../../../models/task';
@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private _filterSource = new BehaviorSubject<IFilter>('all');
  filterMessage$ = this._filterSource.asObservable();
  constructor() {}
  get filter() {
    return this._filterSource.value;
  }
  updateFilter(updatedFilter: IFilter) {
    this._filterSource.next(updatedFilter);
  }
  resetFilter() {
    this._filterSource.next('all');
  }
}
