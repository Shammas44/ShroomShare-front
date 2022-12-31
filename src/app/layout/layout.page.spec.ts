import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LayoutPage } from './layout.page';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

xdescribe('LayoutPage', () => {
  let component: LayoutPage;
  let fixture: ComponentFixture<LayoutPage>;

  beforeEach(waitForAsync(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      declarations: [LayoutPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        AuthService,
        ActivatedRoute,
        {
          provide: Storage,
          useValue: storage,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
