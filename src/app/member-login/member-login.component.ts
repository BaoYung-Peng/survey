import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../@service/auth.service';

@Component({
  selector: 'app-member-login',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './member-login.component.html',
  styleUrl: './member-login.component.scss'
})
export class MemberLoginComponent {
  showPassword = false;
  account!: string;
  password!: string;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  changePasswordIcon() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const validAccount = 'user';  // 測試用帳號
    const validPassword = '123'; // 測試用密碼

    if (this.account === validAccount && this.password === validPassword) {
      this.authService.isMember = true;
      this.router.navigate(['/questionnairead']);
    } else {
      alert('帳號或密碼錯誤，請重試');
    }
  }
  goback(){
    this.router.navigate(['/homepage']);
  }
}

