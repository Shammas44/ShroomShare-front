import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpeciesProviderService } from './species-provider.service';
import { Storage } from '@ionic/storage';

describe('SpeciesProviderService', () => {
  let service: SpeciesProviderService;

  beforeEach(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Storage, useValue: storage }],
    });
    service = TestBed.inject(SpeciesProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
