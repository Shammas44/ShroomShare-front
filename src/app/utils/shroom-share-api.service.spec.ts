import { TestBed } from '@angular/core/testing';

import { ShroomShareApiService } from './shroom-share-api.service';

describe('ShroomShareApiService', () => {
  let service: ShroomShareApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShroomShareApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
