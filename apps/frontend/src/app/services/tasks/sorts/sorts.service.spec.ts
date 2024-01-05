import { TestBed } from '@angular/core/testing';

import { SortsService } from './sorts.service';

describe('SortsService', () => {
  let service: SortsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
