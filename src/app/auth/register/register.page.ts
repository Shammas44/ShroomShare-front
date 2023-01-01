import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthRequest } from '../../models/auth';

type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  rePassword: string;
};
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  authRequest: RegisterRequest;
  loginError: boolean | undefined = undefined;

  constructor() {
    this.authRequest = {
      username: '',
      email: '',
      password: '',
      rePassword: '',
    };
  }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    // Do not do anything if the form is invalid.
    if (form.invalid) {
      return;
    }
    // Hide any previous login error.
    this.loginError = false;
    // Perform the authentication request to the API.
    // this.auth.logIn$(this.authRequest).subscribe({
    //   next: () => this.router.navigateByUrl('/'),
    //   error: (err) => {
    //     this.loginError = true;
    //     console.warn(`Authentication failed: ${err.message}`);
    //   },
    // });
  }
}
