import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    username: string = '';
    password: string = '';
    sex: string = '';
    age: number | null = null;
    education: string = '';
    email: string = '';
    message: string = '';
    avatarFile: File | null = null;
    avatarPreview: string | ArrayBuffer | null = null;


    constructor(private router: Router){}

    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.avatarFile = file;

        // 顯示預覽圖片
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarPreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }

    onSubmit() {
      if (!this.avatarFile) {
        this.message = '請選擇頭像';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const avatarBase64 = reader.result as string;

        // 將資料儲存到假資料中
        const newUser = {
          username: this.username,
          password: this.password,
          sex: this.sex,
          age: this.age,
          education: this.education,
          email: this.email,
          avatar: avatarBase64,
        };

        // 假設有一個假資料陣列
        // this.fakeUsers.push(newUser);

      };
      reader.readAsDataURL(this.avatarFile);
    }

    submit(){
      this.router.navigate(['/memberlogin']);
      alert("註冊成功")
    }
    goback(){
      this.router.navigate(['/memberlogin']);
    }
  }
    // 這裡可以加入假資料註冊邏輯
