import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from 'src/app/models/response';
import { PickerComponent } from './picker.component';
import { User } from 'src/app/models/users';

function createUser(numberOfUsers: number): User[] {
  const timestamp = Date.now();
  const users = [];
  for (let i = 0; i < numberOfUsers; i++) {
    const key = timestamp + 1;
    users.push({ id: key.toString(), username: `user${key}`, admin: false });
  }
  return users;
}
const getUsers$ = (): Observable<PaginatedResponse<User>> => {
  return of({
    pageSize: 5,
    currentPage: 1,
    lastPage: 1,
    message: 'succes',
    items: createUser(5),
  });
};

describe('PickerComponent', () => {
  let component: PickerComponent;
  let fixture: ComponentFixture<PickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PickerComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerComponent);
    component = fixture.componentInstance;
    component.getItem = getUsers$;
    component.itemKeys = { id: 'id', searchable: 'username' };
    component.useFavorite = true;
    component.allFavorites = createUser(3);
    fixture.detectChanges();
    const event = new CustomEvent('search', { detail: { value: 'user' } });
    component.onInputChange(event);
  });

  it('onCheck', () => {
    const userIndex = 0;
    const user = component.state.items[userIndex];
    const checkUserEvent = new CustomEvent('check', { detail: { checked: true, value: user } });
    const unCheckUserEvent = new CustomEvent('check', { detail: { checked: false, value: user } });
    component.onCheck(checkUserEvent);
    expect(component.state.chips.size).toEqual(1);
    expect(component.state.items[userIndex].checked).toEqual(true);
    component.onCheck(unCheckUserEvent);
    expect(component.state.chips.size).toEqual(0);
    expect(component.state.items[userIndex].checked).toEqual(false);
  });

  it('onCheck favorite', () => {
    const index = 0;
    const user = component.state.items[index];
    console.log(component.state.items)
    const favorite = component.state.favorites[index];
    const checkUserEvent = new CustomEvent('check', { detail: { checked: true, value: user } });
    const checkFavoriteEvent = new CustomEvent('check', {
      detail: { checked: true, value: favorite },
    });
    component.onCheck(checkUserEvent);
    component.onCheck(checkFavoriteEvent);
    const username = component.state.items[0]['username'];
    const favoriteUsername = component.state.favorites[0]['username'];
    component.onChipClick(username);
    expect(component.state.chips.size).toEqual(1);
    expect(component.state.items[index].checked).toEqual(false);
    component.onChipClick(favoriteUsername);
    expect(component.state.chips.size).toEqual(0);
    expect(component.state.favorites[index].checked).toEqual(false);
  });
});
