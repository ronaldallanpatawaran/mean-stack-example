import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  insertEmailLabel = 'Email'
  errorEmailLabel = 'Invalid email!'
  insertPasswordLabel = 'Password'
  errorPasswordLabel = 'Invalid password'

  isLoading = false

  private authStatusSubs: Subscription

  constructor (private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe((authStatus)=> {
      this.isLoading = false
    })
  }
  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe()
  }

  onLogin (form: NgForm) {
    this.isLoading = true
    this.authService.login(form.value.email, form.value.password)
  }
}
