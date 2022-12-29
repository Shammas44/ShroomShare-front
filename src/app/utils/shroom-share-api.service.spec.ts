import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShroomShareApiService } from './shroom-share-api.service';

describe('ShroomShareApiService', () => {
  let service: ShroomShareApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ShroomShareApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
