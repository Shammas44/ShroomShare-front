import { Injectable } from '@angular/core';
import { ShroomShareApiService } from './shroom-share-api.service';
import { Specy, SpeciesFilter } from '../models/species';
import { Storage } from '@ionic/storage';
import { CustomMap,storageKeys } from '../models/standard';

@Injectable({
  providedIn: 'root',
}) 
export class SpeciesProviderService {
  species: CustomMap<Specy> = new Map();
  constructor(private api: ShroomShareApiService, private storage: Storage) {
    this.api = api;
  }

  async doIfNewSpeciesAreAvailable(callback: Function) {
    const species = await this.storage.get(storageKeys.species);
    const speciesTotal = species?.length ?? 0;
    this.api.countSpecies$().subscribe({
      next: (res) => {
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

    const store = (option: SpeciesFilter) => {
      this.api.getSpecies$(option).subscribe({
        next: (res) => {
          option.currentPage = res.currentPage + 1;
          currentPage = res.currentPage + 1;
          lastPage = res.lastPage;
          for (const specy of res.items) {
            this.species.set(specy.id, specy);
          }
          this.storage.set(storageKeys.species, this.species);
        },
        error: (err) => {
          console.log({ err });
        },
      });
      if (currentPage < lastPage) store(option);
    };
    store(option);
  }
}
