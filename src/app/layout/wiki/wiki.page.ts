import { Component, OnInit } from '@angular/core';
import { Specy } from 'src/app/models/specy';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],
})
export class WikiPage implements OnInit {
  species: Specy[];

  constructor(private api: ShroomShareApiService) {
    this.species = [];
  }

  ngOnInit() {
    this.api.getSpecies$({ showPictures: true }).subscribe({
      next: (species) => {
        console.log(1, species);
        this.species = species;
      },
      error: (err) => {
        console.warn(`${err.message}`);
      },
    });
    setTimeout(() => {
      this.api
        .getSpecies$({
          currentPage: 2,
          showPictures: true,
        })
        .subscribe({
          next: (species) => {
            console.log(2, species);
            this.species = species;
          },
          error: (err) => {
            console.warn(`${err.message}`);
          },
        });
    }, 5000);
  }
}
