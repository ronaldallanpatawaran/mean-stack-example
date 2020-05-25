import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms'

import { AuthService } from '../auth.service'

@Component({
  styleUrls: ['./signup.component.css'],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  insertEmailLabel = 'Email'
  errorEmailLabel = 'Invalid email!'
  insertPasswordLabel = 'Password'
  errorPasswordLabel = 'Invalid password'

  isLoading = false

  constructor (private authService: AuthService) {}

  onLogin (form: NgForm) {
    this.authService.createUser(form.value.email, form.value.password)
  }
}
