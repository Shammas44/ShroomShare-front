import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CardList } from './cards-list';
import { Storage } from '@ionic/storage';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/users';
import { PaginatedResponse } from 'src/app/models/response';

function createUser(numberOfUsers: number): User[] {
  const timestamp = Date.now();
  const users = [];
  for (let i = 0; i < numberOfUsers; i++) {
    const key = timestamp + 1;
    users.push({
      id: key.toString(),
      username: `user${key}`,
      admin: false,
      email: `user${key}@gmail.com`,
    });
  }
  return users;
}

@Component({
  selector: 'app-cards-list',
  template: `
    <ion-content>
      <div>
        <ion-list class="ion-content-scroll-host" id="wrapper">
          <ion-item *ngFor="let user of items">
            <div>{{ user.username }} {{ user.admin }} {{ user.id }}</div>
          </ion-item>
        </ion-list>
        <ion-infinite-scroll (ionInfinite)="onIonInfinite($event)">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
    </ion-content>
  `,
})
class CardsListComponent extends CardList<User> implements OnInit {
  storageRequestParamKey: string = 'test-users';

  getUsers$(): Observable<PaginatedResponse<User>> {
    return of({
      pageSize: 5,
      currentPage: this.currentPage,
      lastPage: 10,
      message: 'succes',
      items: createUser(5),
    });
  }

  ngOnInit(): void {
    this.initalItemSetting();
  }

  constructor(storage: Storage) {
    super(storage);
  }

  getItems$(): Observable<PaginatedResponse<User>> {
    return this.getUsers$() as Observable<PaginatedResponse<User>>;
  }
}

describe('CardList abstract class', () => {
  let component: CardsListComponent;
  let fixture: ComponentFixture<CardsListComponent>;

  beforeEach(async () => {
    const storage = new Storage();
    await storage.create();
    await storage.clear();
    TestBed.configureTestingModule({
      declarations: [CardsListComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: Storage,
          useValue: storage,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    console.log(await storage.keys());
  });

  it('should add new items on scroll', () => {
    console.log({ component });
    expect(component.items.length).toEqual(5);
    jasmine.clock().install();
    const mockEvent = jasmine.createSpyObj('', [], {
      target: jasmine.createSpyObj('', ['complete']),
    });
    component.onIonInfinite(mockEvent);
    jasmine.clock().tick(500);
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(component.items.length).toEqual(10);
    jasmine.clock().uninstall();
  });
});
