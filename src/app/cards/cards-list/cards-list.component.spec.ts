import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CardsListComponent } from './cards-list.component';
import { Storage } from '@ionic/storage';

describe('CardsListComponent', () => {
  let component: CardsListComponent;
  let fixture: ComponentFixture<CardsListComponent>;

  beforeEach(waitForAsync(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      declarations: [CardsListComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        ShroomShareApiService,
        {
          provide: Storage,
          useValue: storage,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
