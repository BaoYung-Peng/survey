import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    isAdmin = false;

    constructor() { }
    login(account: string, password: string): boolean {
      // 這裡可以改成呼叫後端 API 來驗證帳密
      if (account === 'admin' && password === '123') {
        this.isAdmin = true;
        return true;
      }
      return false;
    }
}
