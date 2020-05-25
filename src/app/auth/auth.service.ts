import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { AuthData } from './auth.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private urlPath = 'http://localhost:3000/api/user'

  constructor (private http: HttpClient){}

  createUser (email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http.post(`${this.urlPath}/signup`, authData)
      .subscribe((result)=> {
        console.log(result)
      })
  }

  loginUser (email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http.post(`${this.urlPath}/login`, authData)
    .subscribe((result)=> {
      console.log(result)
    })
  }
}
