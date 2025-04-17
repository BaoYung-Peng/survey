import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QuizService } from './../../@http-services/quiz.service';
import { Quiz } from '../../models/quiz.model';
import { Router } from '@angular/router';
import { DateService } from '../../@service/date.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuestService } from '../../@service/quest.service';

@Component({
  selector: 'app-homepage',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginator
    ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})

export class HomepageComponent implements OnInit {

    // 問卷資料陣列，儲存從後端取得的問卷
    quizzes: Quiz[] = [];

    // Angular Material 表格的資料來源
    dataSource = new MatTableDataSource<Quiz>();

    // 表格要顯示的欄位
    displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'status','actions'];

    // 載入狀態的旗標，用來顯示 loading 中的畫面
    isLoading = false;

    // 儲存錯誤訊息（如果發生錯誤）
    error: string | null = null;

    // 分頁元件 ViewChild，用來取得 paginator 的實例
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // 建構函式：注入需要用到的服務（問卷服務、路由、時間處理、HTTP 請求）
    constructor(
      private quizService: QuizService,       // 取得問卷資料的服務
      private router: Router,                 // 控制頁面導向
      public dateService: DateService,        // 負責時間格式轉換的服務
      public http: HttpClient,                // Angular 提供的 HTTP 請求工具
      public questService: QuestService
    ) {}

    // 元件初始化時執行，會載入問卷資料
    ngOnInit(): void {
      this.loadQuizzes();
    }

    // 當畫面元素載入完成後，將 paginator 套用到表格資料來源
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
    }

    // 載入問卷資料的方法
    loadQuizzes(): void {
      this.isLoading = true;    // 顯示 loading 狀態
      this.error = null;        // 清除先前的錯誤訊息

      // 呼叫服務取得所有問卷
      this.quizService.getAllQuizzes().subscribe({
        // 成功接收資料
        next: ({ quizList }) => {
          this.quizzes = quizList;            // 儲存到 quizzes 陣列
          this.dataSource.data = quizList;    // 套用到 Angular Material 表格
          this.isLoading = false;             // 關閉 loading 狀態
        },
        // 若有錯誤，顯示錯誤訊息
        error: (err) => {
          this.error = err.message;           // 儲存錯誤訊息
          this.isLoading = false;             // 關閉 loading 狀態
          console.error('載入問卷失敗:', err); // 印出錯誤詳細資訊
        }
      });
    }

    // 判斷問卷目前狀態的方法
    calculateStatus(quiz: Quiz): string {
      const now = new Date();                     // 取得現在時間
      const start = new Date(quiz.startDate);     // 問卷開始時間
      const end = new Date(quiz.endDate);         // 問卷結束時間

      if (quiz.isPublished) return '未發布';       // 還沒發布
      if (now < start) return '尚未開始';          // 現在比開始時間早
      if (now > end) return '已結束';              // 現在比結束時間晚
      return '進行中';                             // 其他情況即為進行中
    }

    startFilling(quiz: Quiz) {
      const status = this.calculateStatus(quiz);
      if (status !== '進行中') {
        alert(`此問卷目前狀態為「${status}」，無法填寫！`);
        return;
      }

      this.isLoading = true;
      this.quizService.postApi("http://localhost:8080/quiz/getById", { id: quiz.id }).subscribe({
        next: (res: any) => {
          console.log('API 驗證成功:', res);
          this.questService.quest = res;
          this.router.navigate(['/questionnairebox', quiz.id]);
        },
        error: (err) => {
          console.error('API 驗證失敗:', err);
          alert('問卷 ID 無效或無法載入！');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }

    viewQuizDetails(id: number): void {
      this.router.navigate(['/quiz', id]);
    }

    memberLogin() {
      this.router.navigate(['/memberlogin']);
    }

    goLogin() {
      this.router.navigate(['/login']);
    }
  }

