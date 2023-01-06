import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from '../../../utils/confirm-password.directive';
import { AuthService } from '../../../auth/auth.service';
import { ModifyUserRequest, User } from 'src/app/models/users';
import { ToastController } from '@ionic/angular';
import { getPresentToastFunc, ToastOptions, ToastTypes } from '../../../utils/utility-functions';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { Location } from '@angular/common';

type Controls = {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  rePassword: FormControl<string>;
  oldPassword: FormControl<string>;
};

type Form = FormGroup & {
  controls: Controls;
};

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
  presentToast: (options: ToastOptions | string) => void;
  user: User | undefined = undefined;
  errorMessage: string | null = null;
  form: Form;

  private MSG = {
    ERROR_FALSE_PASSWORD: 'Echec de la modification. Votre ancien mot de passe est incorrect.',
    ERROR_IDENTITY_UNKNOWN: 'Impossible de vérifier votre identitié! Tentez de vous reconnecter.',
    ERROR_USER_MODIFICATION: "Echec de modification, Quelque chose s'est mal passée.",
    SUCCES_USER_MODIFICATION: 'Données modifiées avec succès.',
  };

  get username(): FormControl<string | undefined> {
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
    private api: ShroomShareApiService,
    private location: Location
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
    const user = this.location.getState() as User;
    this.user = user;
    if (!user) this.errorMessage = this.MSG.ERROR_IDENTITY_UNKNOWN;
    this.form = new FormGroup({
      username: new FormControl(user?.username ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
      }),
      email: new FormControl(user?.email ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      oldPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.minLength(8),
          Validators.maxLength(100),
          matchValidator('rePassword', true),
        ],
      }),
      rePassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.minLength(8),
          Validators.maxLength(100),
          matchValidator('password'),
        ],
      }),
    });
  }

  ngOnInit() {}

  login(): void {
    this.errorMessage = null;
    const user = {
      username: this.user?.username || '',
      password: this.oldPassword.value,
    };
    console.log({ user });
    this.auth.logIn$(user).subscribe({
      next: () => {
        this.modifyUser();
      },
      error: () => {
        this.presentToast({ message: this.MSG.ERROR_FALSE_PASSWORD, icon: ToastTypes.error });
      },
    });
  }

  private modifyUser(): void {
    const user: ModifyUserRequest = {
      username: this.username.value,
      email: this.email.value,
    };
    if (this.password.value !== '') user.password = this.password.value;
    const id = this.user?.id || '';
    this.api.modifyUser$(id, user).subscribe({
      next: () => {
        this.presentToast({ message: this.MSG.SUCCES_USER_MODIFICATION, icon: ToastTypes.success });
      },
      error: () => {
        this.presentToast({ message: this.MSG.ERROR_USER_MODIFICATION, icon: ToastTypes.error });
      },
    });
  }
}
