import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoosenUser } from '../../models/users';
import { ModalController } from '@ionic/angular';
import { Usage } from 'src/app/models/usages';
import { FilterForm, ChoosenItem } from '../../models/standard';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { Observable } from 'rxjs';
import { User, UserFilter } from '../../models/users';
import { PaginatedResponse } from '../../models/response';

export class UsageMap extends Map<string, Usage> {}

function getUsers(api: ShroomShareApiService) {
  return (option: UserFilter): Observable<PaginatedResponse<User>> => {
    return api.getUsers$(option);
  };
}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
}) // eslint-disable-line
export class FiltersModalComponent implements OnInit {
  @Output() filter = new EventEmitter<FilterForm>();

  usage: UsageMap = new UsageMap();
  radius: number = 0;
  favoriteUsers: ChoosenUser[] = [];
  allUsages: Usage[] = [Usage.edible, Usage.inedible];
  getUsers: (option: UserFilter) => Observable<PaginatedResponse<User>>;

  ngOnInit() {}

  constructor(private modalCtrl: ModalController, private api: ShroomShareApiService) {
    this.getUsers = getUsers(this.api);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const form = {
      favoriteUsers: this.favoriteUsers,
      usage: Array.from(this.usage.values()),
      radius: this.radius,
    };
    return this.modalCtrl.dismiss(form);
  }

  onChoosenUser(users: Event) {
    console.log({ users });
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const usage = event.detail.value;
    const isChecked = event.detail.checked;
    if (isChecked) this.usage.set(usage, usage);
    if (!isChecked) this.usage.delete(usage);
  }
}
