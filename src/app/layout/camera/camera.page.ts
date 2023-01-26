import { Component, OnInit } from '@angular/core';
import { PictureService } from 'src/app/picture/picture.service';
import { Observable, map } from 'rxjs';
import { Specy } from 'src/app/models/species';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { PaginatedResponse } from 'src/app/models/response';
import { SpeciesFilter } from 'src/app/models/species';
import { Geolocation } from '@capacitor/geolocation';
import { AddMushroomRequest } from 'src/app/models/mushrooms';
import { NgForm } from '@angular/forms';
import * as L from 'leaflet';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ToastOptions, ToastTypes } from 'src/app/utils/utility-functions';
import { getPresentToastFunc } from 'src/app/utils/utility-functions';

import { Form } from '@angular/forms';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  presentToast: (options: ToastOptions | string) => void;
  MushroomForm2: FormGroup = new FormGroup({
    description: new FormControl(''),
    specyId: new FormControl(''),
  });
  submitted = false;

  constructor(
    private pictureService: PictureService,
    private apiService: ShroomShareApiService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private route: Router
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
  }
  pictureTaked: Boolean = false;
  pictureBase64: string;
  speciesList$: Observable<Specy[]>;
  userLocation: any;
  isLocated: boolean;
  locationSelected: JSON;
  picture: string | undefined;
  notNow: Boolean;
  date: number = Date.now();
  dateFormat: Date = new Date(this.date);
  SpeciesSelect: Boolean;
  isDone: Boolean;

  // }

  ngOnInit() {
    this.MushroomForm2 = this.formBuilder.group({
      description: ['', Validators.maxLength(800)],
      specyId: ['', Validators.required],
    });

    this.speciesList$ = this.getSpecies();
    this.printCurrentPosition();

    this.takePicture();
    // this.takePicture();
    // this.MushroomForm = new FormGroup({
    //   specy_id: new FormControl('', {
    //     nonNullable: true,
    //     validators: [Validators.required],
    //   }),
    //   description: new FormControl('', {
    //     nonNullable: false,
    //     validators: [Validators.maxLength(800)],
    //   }),
    // });

    // this.map = L.map('map').setView([46.7785, 6.6412]);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.MushroomForm2.controls;
  }
  takePicture() {
    this.pictureTaked = false;
    this.pictureService.takePicture().subscribe(
      (data) => {
        this.pictureTaked = true;
        this.pictureBase64 = `data:image/${data.format};base64,${data.base64String}`;
      },
      (err) => (this.pictureTaked = false)
    );
  }

  // takePicture() {
  //   this.pictureTaked = false;
  //   this.pictureService.takePicture().subscribe((data) => {
  //     this.pictureTaked = true;
  //     this.pictureBase64 = `data:image/${data.format};base64,${data.base64String}`;
  //     console.log(data);
  //   });
  // }

  public getSpecies(): Observable<Specy[]> {
    let total;
    this.apiService.countSpecies$().subscribe((res: any) => {
      total = res;
    });
    this.apiService.countSpecies$().subscribe((result: any) => {
      console.log('nombre de species', result);
      let filter: SpeciesFilter = { pageSize: result?.count };
      this.apiService.getSpecies$(filter).subscribe((r: any) => {
        console.log(r);
      });
    });
    return this.apiService
      .getSpecies$({ pageSize: 20 })
      .pipe(map<PaginatedResponse<any>, Specy[]>((PaginatedResponse) => PaginatedResponse.items));
  }

  printCurrentPosition = async () => {
    const coordinates: any = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
    this.userLocation = coordinates;
    if (this.userLocation) {
    }
  };

  SetcurrentLocation() {
    if (!this.userLocation) {
    } else {
      this.isLocated = true;
      this.locationSelected = this.userLocation;
    }
  }

  addMushroom() {
    // console.log('finalement', this.MushroomForm2.value);
    // console.log('la specy id', this.MushroomForm2.value.Species);
    // console.log('la description', this.MushroomForm2.value.Description);
    // if (this.notNow) {
    //   this.date = new Date(this.MushroomForm.value.dateNotNow).getTime();
    // }
    // console.log(this.MushroomForm);
    // console.log(this.userLocation.coords);
    const mushroom: AddMushroomRequest = {
      specy_id: this.MushroomForm2.value.specyId,
      picture: this.pictureBase64,
      description: this.MushroomForm2.value.description,
      date: this.date,
      location: {
        type: 'Point',
        coordinates: [this.userLocation.coords.latitude, this.userLocation.coords.longitude],
      },
    };
    console.log('mushroom to add', mushroom);
    this.apiService.addMushroom$(mushroom).subscribe({
      next: () => {
        this.presentToast({
          message: 'Le cahmpignon a été ajouté avec succès',
          icon: ToastTypes.success,
        });
        this.route.navigate(['profil/my-mushrooms']);
      },
      error: () => {
        this.presentToast({
          message: "Echec de l'ajout, Quelque chose s'est mal passée.",
          icon: ToastTypes.success,
        });
        this.route.navigate(['mushrooms']);
      },
    });
    // this.takePicture();
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.MushroomForm2.value);
    if (this.MushroomForm2.invalid) {
      return;
    }
  }

  onReset() {
    this.submitted = false;
    this.MushroomForm2.reset();
  }

  userSetDate() {
    this.notNow = true;
  }
}
