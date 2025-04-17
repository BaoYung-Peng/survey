import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../@service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword = false;
  account!: string;
  password!: string;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  changePasswordIcon() {
    this.showPassword = !this.showPassword;
  }

  // login() {
  //   this.userService.isAdmin = true;
  //   this.router.navigate(['/questionnaire-ad']);
  // }

  login() {
    const validAccount = 'admin';  // 測試用帳號
    const validPassword = '123'; // 測試用密碼

    if (this.account === validAccount && this.password === validPassword) {
      this.userService.isAdmin = true;
      this.router.navigate(['/homepagead']);
    } else {
      alert('帳號或密碼錯誤，請重試');
    }
  }
  loginout(){
    this.router.navigate(['/homepage']);
  }
}
