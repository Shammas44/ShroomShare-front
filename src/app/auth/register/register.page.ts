import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from '../../utils/confirm-password.directive';
import { AuthService } from '../auth.service';
import {emailValidator} from '../../utils/email.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  errorMessage: string | null = null;
  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, emailValidator()],
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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.errorMessage = null;
    const request = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
    };
    this.auth.addUser$(request).subscribe({
      next: (msg) => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        if (err.message === 'Username is already taken.') {
          this.errorMessage = "Le nom d'utilisateur est déjà pris";
        }else {
          this.errorMessage = "Quelque chose s'est mal passé, veuillez réessayer";
        }
      },
    });
  }
}
