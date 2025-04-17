import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateService } from './@service/date.service';
import { UserService } from './@service/user.service';
import { MatIconModule } from '@angular/material/icon'; // 導入 MatIconModule
import { QuizService } from './@http-services/quiz.service';
import { MatTabsModule } from '@angular/material/tabs';
import { IconDefinition } from '@ant-design/icons-angular';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HomeOutline, LaptopOutline, NotificationOutline, UserOutline } from '@ant-design/icons-angular/icons';

// 註冊需要的圖標
const icons: IconDefinition[] = [
  UserOutline,
  LaptopOutline,
  NotificationOutline,
  HomeOutline
];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})



export class AppComponent {
  title = 'survey';
  constructor(private dateService:DateService,private userService:UserService,
       private router:Router,private quizService:QuizService){}


  isActive = false; // 根據條件設置 isActive

  toggleActive() {
    this.isActive = !this.isActive; // 切換激活狀態
    this.router.navigate(['/homepage']);
  }

  currentDate: string = ''; // 用於存儲格式化後的日期
  ngOnInit(): void {
    // 獲取當前日期
    const today = new Date();
    this.currentDate = this.dateService.changeDateFormat(today, '/');
     // 檢查瀏覽器的首選主題，若是深色模式則設為深色主題
     const storedTheme = localStorage.getItem('theme');
     if (storedTheme) {
       this.isDarkTheme = storedTheme === 'dark';
     } else {
       this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
     }
  }

  isDarkTheme = false;

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    // 儲存選擇的主題
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }


  gohomead(){
    this.router.navigate(['/homepagead']);
  }
}
