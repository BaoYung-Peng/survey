import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private router: Router){}

  onSubmit() {
    this.message = '重設密碼連結已發送至您的 Email';
  }

  goback(){
    this.router.navigate(['/memberlogin']);
  }
}
