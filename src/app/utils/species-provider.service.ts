import { Injectable } from '@angular/core';
import { ShroomShareApiService } from './shroom-share-api.service';
import { Specy } from '../models/species';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
}) //eslint-disable-line
export class SpeciesProviderService {
  species: Specy[] = [];
  constructor(private api: ShroomShareApiService, private storage: Storage) {
    this.api = api;
  }

  async doIfNewSpeciesAreAvailable(callback: Function) {
    const species = await this.storage.get('species');
    const speciesTotal = species?.length ?? 0;
    this.api.countSpecies$().subscribe({
      next: (res) => {
        console.log({ coutn: res.count, speciesTotal });
        if (res.count !== speciesTotal) callback();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  storeSpecies() {
    let lastPage = 1;
    let currentPage = 1;
    const option = {
      pageSize: 100,
      currentPage: 1,
      showPictures: true,
    };

    // TODO: impossible to execute async code into a dowhile

    do {
      this.api.getSpecies$(option).subscribe({
        next: (res) => {
          option.currentPage = res.currentPage + 1;
          currentPage = res.currentPage + 1;
          lastPage = res.lastPage;
          for (const specy of res.species) {
            this.species.push(specy);
          }
          this.storage.set('species', this.species);
          console.log(this.storage.get('species'), 'species');
        },
        error: (err) => {
          console.log({ err });
        },
      });
    } while (currentPage < lastPage);
  }
}
