import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'
import { AuthService } from '../auth.service';

@Component({
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  insertEmailLabel = 'Email'
  errorEmailLabel = 'Invalid email!'
  insertPasswordLabel = 'Password'
  errorPasswordLabel = 'Invalid password'

  isLoading = false

  constructor (private authService: AuthService) {}

  onLogin (form: NgForm) {
    this.authService.login(form.value.email, form.value.password)
  }
}
