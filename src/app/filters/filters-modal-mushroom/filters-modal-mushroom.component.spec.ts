import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltersModalMushroomComponent } from './filters-modal-mushroom.component';

describe('FiltersModalMushroomComponent', () => {
  let component: FiltersModalMushroomComponent;
  let fixture: ComponentFixture<FiltersModalMushroomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersModalMushroomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersModalMushroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
