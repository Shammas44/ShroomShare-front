import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltersModalMyMushroomComponent } from './filters-modal-my-mushroom.component';

describe('FiltersModalMyMushroomComponent', () => {
  let component: FiltersModalMyMushroomComponent;
  let fixture: ComponentFixture<FiltersModalMyMushroomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersModalMyMushroomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersModalMyMushroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
