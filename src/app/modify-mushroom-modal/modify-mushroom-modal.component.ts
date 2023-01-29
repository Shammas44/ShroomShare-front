import { Component, OnInit, Input } from '@angular/core';
import { MushroomWithPic } from 'src/app/models/mushrooms';
import { PictureService } from 'src/app/picture/picture.service';
import { Observable, map } from 'rxjs';
import { Specy } from '../models/species';
import { ShroomShareApiService } from '../utils/shroom-share-api.service';
import { PaginatedResponse } from '../models/response';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ModifyMushroomRequest } from '../models/mushrooms';
import { ToastOptions, ToastTypes } from '../utils/utility-functions';
import { getPresentToastFunc } from 'src/app/utils/utility-functions';
import { ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modify-mushroom-modal',
  templateUrl: './modify-mushroom-modal.component.html',
  styleUrls: ['./modify-mushroom-modal.component.scss'],
})
export class ModifyMushroomModalComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  presentToast: (options: ToastOptions | string) => void;

  @Input('mushroom') mushroom: MushroomWithPic;

  pictureBase64: any;
  speciesList$: Observable<Specy[]>;
  ModifySpecy: Boolean = false;
  modifyPicture: Boolean = false;
  modifyDesc: Boolean = false;
  currentspecy: string;
  currentSpecyId: string;
  currentDescription: string;
  Description: string;

  mushroomForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    specyId: new FormControl(''),
  });

  constructor(
    private pictureService: PictureService,
    private apiService: ShroomShareApiService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
  }

  ngOnInit() {
    this.pictureBase64 = this.mushroom.picture.value;
    this.speciesList$ = this.getSpecies();
    this.currentspecy = this.mushroom.specy.name;
    this.currentSpecyId = this.mushroom.specy.id;
    this.currentDescription = this.mushroom.description;
    this.Description = this.mushroom.description;

    this.mushroomForm = this.formBuilder.group({
      description: [this.mushroom.description, Validators.maxLength(800)],
      specyId: [this.mushroom.specy.id],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.mushroomForm.controls;
  }

  private MSG = {
    ERROR_MUSHROOM_MODIFICATION: "Echec de modification, Quelque chose s'est mal passée.",
    SUCCES_MUSHROOM_MODIFICATION: 'Données modifiées avec succès.',
  };

  takePicture() {
    this.pictureService.takePicture().subscribe((data) => {
      this.pictureBase64 = `data:image/${data.format};base64,${data.base64String}`;
      this.modifyPicture = true;
    });
  }

  public getSpecies(): Observable<Specy[]> {
    return this.apiService
      .getSpecies$({ pageSize: 20 })
      .pipe(map<PaginatedResponse<any>, Specy[]>((PaginatedResponse) => PaginatedResponse.items));
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  modifyMushroom(form: FormGroup) {
    if (form.value.specyId) {
      this.currentSpecyId = form.value.specyId;
    }
    if (form.value.description != this.currentDescription) {
      this.currentDescription = form.value.description;
      this.modifyDesc = true;
    }
    const id = this.mushroom.id;

    const mushroom: ModifyMushroomRequest = {
      specy_id: this.currentSpecyId,
      picture: this.pictureBase64,
      description: this.currentDescription,
    };

    this.apiService.modifyMushroom$(id, mushroom).subscribe({
      next: () => {
        this.presentToast({
          message: this.MSG.SUCCES_MUSHROOM_MODIFICATION,
          icon: ToastTypes.success,
        });
        this.cancel();
      },
      error: () => {
        this.presentToast({
          message: this.MSG.ERROR_MUSHROOM_MODIFICATION,
          icon: ToastTypes.error,
        });
      },
    });
  }
}
