import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { getPresentToastFunc, ToastOptions, ToastTypes } from '../../utils/utility-functions';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/users';
import { storageKeys } from 'src/app/models/standard';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  presentToast: (options: ToastOptions | string) => void;
  getUsers$: Subscription | null;
  user: User | undefined = undefined;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private api: ShroomShareApiService,
    private storage: Storage
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
    this.getUsers$ = this.auth.getUser$().subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  MSG = {
    SUCCES_USER_DELETION: 'Utilisateur supprimé avec succès.',
    ASK_USER_DELETION: 'Voulez vous vraiment supprimer votre compte ?',
    ERROR_USER_DELETION: "Echec de la suppresion, quelque chose s'est mal passé",
  };

  ngOnInit() {}

  logOut() {
    this.auth.clearStorage();
    this.router.navigateByUrl('/login');
  }

  deleteUser(id: string) {
    this.api.deleteUser$(id).subscribe({
      next: () => {
        this.presentToast({ message: this.MSG.SUCCES_USER_DELETION, icon: ToastTypes.success });
        setTimeout(() => {
          this.logOut();
        }, 2000);
      },
      error: () => {
        this.presentToast({ message: this.MSG.ERROR_USER_DELETION, icon: ToastTypes.error });
      },
    });
  }

  private unscubscribe(subscriber: Subscription | null) {
    if (subscriber !== null) subscriber.unsubscribe();
  }

  deleteLocalData() {
    for (const key of Object.values(storageKeys)) {
      if (key !== storageKeys.auth) this.storage.remove(key);
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.MSG.ASK_USER_DELETION,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'alert-button-confirm',
          handler: () => {},
        },
        {
          text: 'Supprimer',
          role: 'confirm',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.user ? this.deleteUser(this.user.id) : console.log('err');
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    this.unscubscribe(this.getUsers$);
  }
}
