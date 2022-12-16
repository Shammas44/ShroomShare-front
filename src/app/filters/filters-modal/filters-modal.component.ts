import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoosenUser } from '../../models/users';
import { ModalController } from '@ionic/angular';
import { Usage } from 'src/app/models/usages';
import { FilterForm, BaseFilter, ChoosenItem } from '../../models/standard';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { Observable } from 'rxjs';
import { User, UserFilter } from '../../models/users';
import { PaginatedResponse } from '../../models/response';
import { Specy, SpeciesFilter, ChoosenSpecy } from '../../models/species';

export class UsageMap extends Map<string, Usage> {}

function getUsers(api: ShroomShareApiService) {
  return (option: UserFilter): Observable<PaginatedResponse<User>> => {
    return api.getUsers$(option);
  };
}

function getSpecies(api: ShroomShareApiService) {
  return (option: SpeciesFilter): Observable<PaginatedResponse<Specy>> => {
    return api.getSpecies$(option);
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
  users: ChoosenItem[] = [];
  species: ChoosenItem[] = [];
  allUsages: Usage[] = [Usage.edible, Usage.inedible];
  getUsers: (option: UserFilter) => Observable<PaginatedResponse<User>>;
  getSpecies: (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>>;
  userKeys = { id: 'id', searchable: 'username' };
  specyKeys = { id: 'id', searchable: 'name' };

  ngOnInit() {}

  constructor(private modalCtrl: ModalController, private api: ShroomShareApiService) {
    this.getUsers = getUsers(this.api);
    this.getSpecies = getSpecies(this.api);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const form = {
      users: this.users,
      species: this.species,
      usage: Array.from(this.usage.values()),
      radius: this.radius,
    };
    return this.modalCtrl.dismiss(form, 'confirm');
  }

  onChoosenUser(users: ChoosenItem[]) {
    console.log({ users });
    this.users = users;
  }

  onChoosenSpecies(species: ChoosenItem[]) {
    console.log({ species });
    this.species = species;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const usage = event.detail.value;
    const isChecked = event.detail.checked;
    if (isChecked) this.usage.set(usage, usage);
    if (!isChecked) this.usage.delete(usage);
  }
}
