import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isMember = false;

  constructor() { }
   memberlogin(account: string, password: string): boolean {
    // 這裡可以改成呼叫後端 API 來驗證帳密
    if (account === 'user' && password === '123') {
      this.isMember = true;
      return true;
    }
    return false;
  }
}
