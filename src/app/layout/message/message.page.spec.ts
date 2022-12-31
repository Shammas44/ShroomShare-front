import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {Storage} from '@ionic/storage';

import { MessagePage } from './message.page';

xdescribe('MessagePage', () => {
  let component: MessagePage;
  let fixture: ComponentFixture<MessagePage>;

  beforeEach(waitForAsync(() => {
    const storage = new Storage();
    storage.create();
    TestBed.configureTestingModule({
      declarations: [ MessagePage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule],
      providers: [{ provide: Storage, useValue: storage }],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
