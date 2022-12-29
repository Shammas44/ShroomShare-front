import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';

describe('AuthService', () => {
  let service: AuthService;
  // let storage: Storage;

  beforeEach(() => {
    // storage = jasmine.createSpyObj('Storage', {});
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Storage, useValue: storage }],
    });
    service = TestBed.inject(AuthService);
    // storage = TestBed.inject(Storage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
