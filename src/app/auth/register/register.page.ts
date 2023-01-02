import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from './confirm-password.directive';
import { AuthService } from '../auth.service';

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
      validators: [Validators.required, Validators.email],
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
    console.log(request);
    this.auth.addUser$(request).subscribe({
      next: () => {
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
