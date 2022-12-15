import { TestBed } from '@angular/core/testing';

import { SpeciesProviderService } from './species-provider.service';

describe('SpeciesProviderService', () => {
  let service: SpeciesProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeciesProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
