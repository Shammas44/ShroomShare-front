import { TestBed } from '@angular/core/testing';

import { StorageService } from './local-storage.service';

xdescribe('LocalStorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
