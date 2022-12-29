import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { WikiPage } from './wiki.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';

describe('WikiPage', () => {
  let component: WikiPage;
  let fixture: ComponentFixture<WikiPage>;

  beforeEach(waitForAsync(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      declarations: [WikiPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [AuthService, { provide: Storage, useValue: storage }],
    }).compileComponents();

    fixture = TestBed.createComponent(WikiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
