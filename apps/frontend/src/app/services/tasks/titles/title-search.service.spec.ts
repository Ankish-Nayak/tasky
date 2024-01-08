import { TestBed } from '@angular/core/testing';

import { TitleSearchService } from './title-search.service';

describe('TitleSearchService', () => {
  let service: TitleSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
