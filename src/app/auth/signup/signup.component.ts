import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service'

@Component({
  styleUrls: ['./signup.component.css'],
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, OnDestroy {
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
    this.authService.createUser(form.value.email, form.value.password)
  }
}
