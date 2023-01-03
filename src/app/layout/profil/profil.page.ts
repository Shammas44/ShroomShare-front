import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  logOut() {
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }

  deleteUser(id: string) {
    this.auth.deleteUser$(id).subscribe({
      next: (message) => {
        this.logOut();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Voulez vous vraiment supprimer votre compte ?',
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
            this.auth.getUser$().subscribe({
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
  }
}
