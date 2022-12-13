import { Component, OnInit } from '@angular/core';
import { ChoosenUser  } from '../../models/users';
import { ModalController } from '@ionic/angular';
import { Usage } from 'src/app/models/usages';

type FilterForm = {
  favoriteUsers: ChoosenUser[];
  usage: Usage;
  radius: number;
};

export class UsageMap extends Map<string, Usage> {}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
}) // eslint-disable-line
export class FiltersModalComponent implements OnInit {
  usage: UsageMap = new UsageMap();
  radius: number = 0;
  favoriteUsers: ChoosenUser[] = [];
  allUsages: Usage[] = [Usage.edible, Usage.inedible];

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const form = {
      favoriteUsers: this.favoriteUsers,
      usage: this.usage,
      radius: this.radius,
    };
    console.log({ form });
    return this.modalCtrl.dismiss('confirm');
  }

  onChoosenUser(users: ChoosenUser[]) {
    console.log({ users });
  }

  onCheckboxClick(e: Event) {
    const event = e as CustomEvent;
    const usage = event.detail.value;
    const isChecked = event.detail.checked;
    if (isChecked) this.usage.set(usage, usage);
    if (!isChecked) this.usage.delete(usage);
  }

  ngOnInit() {}
}
