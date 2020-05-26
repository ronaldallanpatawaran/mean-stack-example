import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { AuthData } from './auth.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string
  private urlPath = 'http://localhost:3000/api/user'

  constructor (private http: HttpClient){}

  getToken () {
    return this.token
  }

  createUser (email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http.post(`${this.urlPath}/signup`, authData)
      .subscribe((response)=> {
        console.log(response)
      })
  }

  login (email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http.post<{ message: string, token: string }>(`${this.urlPath}/login`, authData)
    .subscribe((response)=> {
      const token = response.token
    })
  }
}
