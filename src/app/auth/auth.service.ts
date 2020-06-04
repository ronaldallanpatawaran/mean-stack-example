import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";
import { Subject } from 'rxjs';

import { AuthData } from './auth.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string
  private urlPath = 'http://localhost:3000/api/user'
  private isAuthenticated = false
  private tokenTimer: any
  private userId: string
  private authStatusListener = new Subject<boolean>();

  constructor (private http: HttpClient, private router: Router){}

  getToken () {
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId () {
    return this.userId
  }

  createUser (email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http
      .post(`${this.urlPath}/signup`, authData)
      .subscribe(()=> {
        this.router.navigate(['/'])
      }, error => {
        this.authStatusListener.next(false)
      })
  }

  login (email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, userId: string }>(
        `${this.urlPath}/login`,
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn
          this.setAuthTimer(expiresInDuration)
          this.isAuthenticated = true;
          this.userId = response.userId
          this.authStatusListener.next(this.isAuthenticated);
          const now = new Date()
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          this.saveAuthData(token, expirationDate, this.userId)
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false)
      });
  }

  autoAuthUser () {
    const authInformation = this.getAuthData()
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authInformation.token
      this.userId = authInformation.userId
      this.isAuthenticated = true
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(this.isAuthenticated)
    }
  }

  logout () {
    this.token = null
    this.isAuthenticated = false
    this.userId = null
    this.authStatusListener.next(this.isAuthenticated)
    this.clearAuthData()
    clearTimeout(this.tokenTimer)
    this.router.navigate(['/login'])
  }

  private setAuthTimer (duration: number) {
    console.log('Setting timer: ' + duration)
    this.tokenTimer = setTimeout(()=> {
      this.logout()
    }, duration * 1000)
  }

  private saveAuthData (token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData () {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData () {
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    const userId = localStorage.getItem('userId')
    return {
      token,
      userId,
      expirationDate: new Date(expirationDate)
    }
  }
}
