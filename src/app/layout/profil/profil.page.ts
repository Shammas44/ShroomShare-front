import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { getPresentToastFunc, ToastOptions } from '../../utils/utility-functions';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  presentToast: (options: ToastOptions | string) => void;
  getUsers$: Subscription | null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private api: ShroomShareApiService
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
    this.getUsers$ = null;
  }

  ngOnInit() {}

  logOut() {
    this.auth.clearStorage();
    this.router.navigateByUrl('/login');
  }

  deleteUser(id: string) {
    console.log('delete fired');
    this.api.deleteUser$(id).subscribe({
      next: () => {
        this.presentToast('Utilisateur supprimé avec succès.');
        setTimeout(() => {
          this.logOut();
        }, 2000);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private unscubscribe(subscriber: Subscription | null) {
    if (subscriber !== null) {
      console.log('unscubscribe');
      subscriber.unsubscribe();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Voulez vous vraiment supprimer votre compte ?',
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
            this.getUsers$ = this.auth.getUser$().subscribe({
              next: (user) => {
                if (user?.id === undefined) return;
                this.deleteUser(user.id);
              },
              error: (err) => {
                console.log(err);
              },
            });
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    this.unscubscribe(this.getUsers$);
  }
}
