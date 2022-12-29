import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';

import { MushroomsPage } from './mushrooms.page';

describe('MushroomsPage', () => {
  let component: MushroomsPage;
  let fixture: ComponentFixture<MushroomsPage>;

  beforeEach(waitForAsync(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      declarations: [MushroomsPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: Storage, useValue: storage }],
    }).compileComponents();

    fixture = TestBed.createComponent(MushroomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
