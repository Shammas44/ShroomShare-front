import { Component, OnInit } from '@angular/core';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { Mushroom, AddMushroomRequest } from 'src/app/models/mushrooms';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { PaginatedResponse } from 'src/app/models/response';
import { Specy } from 'src/app/models/species';
import { SpeciesFilter } from 'src/app/models/species';
import { lastValueFrom, Observable, map } from 'rxjs';
import { Location } from '@angular/common';
import { User } from 'src/app/models/users';
import { getDate } from './../../utils/modal-utility-functions';
import { AuthService } from 'src/app/auth/auth.service';

type Controls = {
  specy_id: FormControl<string>;
  picture: FormControl<string>;
  description?: FormControl<string>;
  date: FormControl<Date>;
  localisation: FormControl<Geolocation>;
};

// type Form = FormGroup & {
//   controls: Controls;
// };

@Component({
  selector: 'app-create-mushroom',
  templateUrl: './create-mushroom.page.html',
  styleUrls: ['./create-mushroom.page.scss'],
})
export class CreateMushroomPage implements OnInit {
  picture: string;
  user: User | undefined = undefined;
  speciesList$: Observable<Specy[]>;
  form: FormGroup;
  loading: boolean = false;
  dateSelect: Date;
  Now: Boolean = true;
  Maintenant: string = new Date(Date.now()).toISOString();
  date: number;

  constructor(
    private ApiService: ShroomShareApiService,
    private location: Location,
    private auth: AuthService
  ) {
    this.picture = '';
    const user = this.location.getState() as User;
    this.user = user;
    this.form = new FormGroup({
      specy_id: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      picture: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        nonNullable: false,
        validators: [Validators.maxLength(800)],
      }),
      date: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      location: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit() {
    this.speciesList$ = this.getSpecies();
    console.log(this.Maintenant);
    // this.Species = this.ApiService.getSpecies$().subscribe;
  }

  // async getSpecies() {
  //   const count = this.ApiService.countSpecies$();
  //   const SpeciesCount = await lastValueFrom(count);
  //   let filter: SpeciesFilter = { pageSize: 20 };
  //   const result = this.ApiService.getSpecies$(filter);
  //   this.speciesList = await lastValueFrom(result);
  // }

  public getSpecies(): Observable<Specy[]> {
    let total;
    this.ApiService.countSpecies$().subscribe((res: any) => {
      total = res;
    });
    this.ApiService.countSpecies$().subscribe((result: any) => {
      console.log('nombre de species', result);
      let filter: SpeciesFilter = { pageSize: result?.count };
      this.ApiService.getSpecies$(filter).subscribe((r: any) => {
        console.log(r);
      });
    });
    return this.ApiService.getSpecies$({ pageSize: 20 }).pipe(
      map<PaginatedResponse<any>, Specy[]>((PaginatedResponse) => PaginatedResponse.items)
    );
  }

  public AffDate() {
    console.log('??????');
    console.log(this.dateSelect);
  }

  public addMushroom(MushroomForm: NgForm) {
    console.log(MushroomForm.value);
    console.log('Value image', MushroomForm.value.Image);
    //console.log('image', MushroomForm.Image.value);
    // console.log(this.dateSelect);
    // '63b436286c02ea79676d640'
    if (this.Now) {
      this.date = Date.now();
    } else {
      this.date = MushroomForm.value.date;
    }
    console.log(this.date);
    const mushroom: AddMushroomRequest = {
      specy_id: MushroomForm.value.Species,
      picture: this.picture,
      description: MushroomForm.value.Description,
      date: Date.now(),
      location: {
        type: 'Point',
        coordinates: [46.67498, 6.356028],
      },
    };
    console.log('mushroom to add', mushroom);
    // this.ApiService.addMushroom$(mushroom).subscribe();
  }
  checkBoxNow(event: any) {
    if (event.detail.checked) {
      this.Now = true;
      //this.date = Date.now();
    } else {
      this.Now = false;
    }
  }

  // login(mushroom: any): void {
  //   const user = {
  //     username: this.user?.username || '',
  //     // password: this.oldPassword.value,
  //   };
  //   console.log({ user });
  //   this.auth.logIn$(user).subscribe({
  //     next: () => {
  //       this.addMushroom(mushroom);
  //     },
  //     error: () => {
  //       console.log("il y a une erreur");
  //     },
  //   });
  // }
}
