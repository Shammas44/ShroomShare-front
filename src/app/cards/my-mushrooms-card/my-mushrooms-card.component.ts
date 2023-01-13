import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { MushroomPicture, MushroomWithPic } from 'src/app/models/mushrooms';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { getPresentToastFunc, ToastOptions, ToastTypes } from 'src/app/utils/utility-functions';

@Component({
  selector: 'app-my-mushroom-card',
  templateUrl: './my-mushrooms-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class MyMushroomsCardComponent implements OnInit {
  @Input() mushroom: MushroomWithPic | null = null;
  @Output() delete: EventEmitter<string> = new EventEmitter();
  @Output() modify: EventEmitter<string> = new EventEmitter();
  showFullText: boolean = false;
  presentToast: (options: ToastOptions | string) => void;
  constructor(
    private api: ShroomShareApiService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
  }

  ngOnInit() {}

  onToggleTextExpand() {
    this.showFullText = this.showFullText ? false : true;
  }

  MSG = {
    ERROR_MUSHROOM_DELETION: "Une erreur s'est produite.",
    ERROR_MUSHROOM_MODIFICATION: "Une erreur s'est produite.",
    SUCCES_MUSHROOM_DELETION: 'Champignon supprimé avec succès.',
    SUCCES_MUSHROOM_MODIFICATION: 'Champignon modifié avec succès.',
    ASK_DELETION_CONFIRMATION: 'Supprimer ce champignon?',
  };

  modifyMushroom(id?: string) {
    if (id === undefined) {
      return this.presentToast({
        message: this.MSG.ERROR_MUSHROOM_MODIFICATION,
        icon: ToastTypes.error,
      });
    }
    this.modify.emit(id)
  }


  async deleteMushroom(id?: string) {
    if (id === undefined) {
      return this.presentToast({
        message: this.MSG.ERROR_MUSHROOM_DELETION,
        icon: ToastTypes.error,
      });
    }
    const alert = await this.alertController.create({
      header: this.MSG.ASK_DELETION_CONFIRMATION,
      cssClass: 'alert',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Supprimer',
          role: 'confirm',
          handler: () => {
            this.api.deleteMushroom$(id).subscribe({
              next: () => {
                this.delete.emit(id);
                this.presentToast({
                  message: this.MSG.SUCCES_MUSHROOM_DELETION,
                  icon: ToastTypes.success,
                });
              },
              error: () => {
                this.presentToast({
                  message: this.MSG.ERROR_MUSHROOM_DELETION,
                  icon: ToastTypes.error,
                });
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  getPicture(picture: string | MushroomPicture) {
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }
}
