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
    console.log('init');
    this.api.getSpecies$().subscribe({
      next: (species) => {
        console.log(species);
        this.species = species;
      },
      error: (err) => {
        console.warn(`Authentication failed: ${err.message}`);
      },
    });
  }
}
