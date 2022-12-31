import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FiltersModalComponent } from './filters-modal.component';
import { Storage } from '@ionic/storage';

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent;
  let fixture: ComponentFixture<FiltersModalComponent>;

  beforeEach(waitForAsync(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      declarations: [FiltersModalComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: Storage, useValue: storage }],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
