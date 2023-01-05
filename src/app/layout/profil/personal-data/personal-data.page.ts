import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from '../../../utils/confirm-password.directive';
import { AuthService } from '../../../auth/auth.service';
import { User } from 'src/app/models/users';
import { ToastController } from '@ionic/angular';
import { getPresentToastFunc, ToastOptions } from '../../../utils/utility-functions';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
  presentToast: (options: ToastOptions | string) => void;
  user: User | undefined = undefined;
  errorMessage: string | null = null;
  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    oldPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        matchValidator('rePassword', true),
      ],
    }),
    rePassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        matchValidator('password'),
      ],
    }),
  });

  private MSG = {
    ERROR_FALSE_PASSWORD:
      'Echec de modification de votre compte. Votre ancien mot de passe est incorrect.',
    ERROR_IDENTITY_UNKNOWN:
      "Impossible de vérifier votre identitié! Tentez de vous reconnecter à l'application.",
    SUCCES_USER_MODIFICATION: 'Données modifiées avec succès.',
  };

  get username(): FormControl<string> {
    return this.form.controls.username;
  }
  get email(): FormControl<string> {
    return this.form.controls.email;
  }
  get password(): FormControl<string> {
    return this.form.controls.password;
  }
  get rePassword(): FormControl<string> {
    return this.form.controls.rePassword;
  }
  get oldPassword(): FormControl<string> {
    return this.form.controls.oldPassword;
  }

  constructor(
    private auth: AuthService,
    private toastController: ToastController,
    private api: ShroomShareApiService
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
    this.auth.getUser$().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: () => {
        this.errorMessage = this.MSG.ERROR_IDENTITY_UNKNOWN;
      },
    });
  }

  ngOnInit() {}

  login(): void {
    this.errorMessage = null;
    const user = {
      username: this.user?.username || '',
      password: this.oldPassword.value,
    };
    this.auth.logIn$(user).subscribe({
      next: () => {
        this.modifyUser();
      },
      error: () => {
        this.presentToast(this.MSG.ERROR_FALSE_PASSWORD);
      },
    });
  }

  private modifyUser(): void {
    const user = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
    };
    const id = this.user?.id || '';
    this.api.modifyUser$(id, user).subscribe({
      next: () => {
        this.presentToast(this.MSG.SUCCES_USER_MODIFICATION);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
