import { Component, OnInit } from '@angular/core';
import { Specy } from 'src/app/models/species';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { SpeciesProviderService } from '../../utils/species-provider.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],
}) //eslint-disable-line
export class WikiPage implements OnInit {
  species: Specy[];

  constructor(private api: ShroomShareApiService, private speciesProvider: SpeciesProviderService) {
    this.species = [];
  }

  onIonInfinite(event: Event) {
    // this.addItems();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async ngOnInit() {
    await this.speciesProvider.doIfNewSpeciesAreAvailable(async () => {
      console.log('init');
      this.speciesProvider.storeSpecies();
    });
    // this.api.getSpecies$({ showPictures: true }).subscribe({
    //   next: (res) => {
    //     this.species = res.items;
    //   },
    //   error: (err) => {
    //     console.warn(`${err.message}`);
    //   },
    // });
    // setTimeout(() => {
    //   this.api
    //     .getSpecies$({
    //       currentPage: 2,
    //       showPictures: true,
    //     })
    //     .subscribe({
    //       next: (res) => {
    //         this.species = res.items;
    //       },
    //       error: (err) => {
    //         console.warn(`${err.message}`);
    //       },
    //     });
    // }, 5000);
  }
}
