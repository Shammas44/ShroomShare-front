import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Storage, useValue: storage }],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
