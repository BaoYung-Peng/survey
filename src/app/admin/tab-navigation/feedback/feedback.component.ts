import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  imports: [
    CommonModule
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedbackData: any;
  filteredFeedbackList: any[] = []; // 新增：過濾後的列表
  isLoading = true;
  error: string | null = null;
  quizId: number | null = null; // 接收問卷 ID

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchFeedbackData();
  }

  fetchFeedbackData(): void {
    this.http.post('http://localhost:8080/quiz/feedback', { id: this.quizId }).subscribe(
      (data: any) => {
        this.feedbackData = data;

        if (data.feedbackList && Array.isArray(data.feedbackList)) {
          this.filteredFeedbackList = data.feedbackList; // 不需要 filter
        } else {
          this.filteredFeedbackList = [];
        }

        console.log('API 回傳資料:', data);
        this.isLoading = false;
      },
      (error) => {
        this.error = '無法載入問卷資料';
        this.isLoading = false;
        console.error('API錯誤:', error);
      }
    );
  }
  viewDetails(userIndex: number): void {
    this.router.navigate(['/feedback-detail', this.quizId, userIndex]), {
      state: {
        quizId: this.quizId,
        feedbackData: this.filteredFeedbackList[userIndex] // 直接傳遞該用戶的資料
      }
    };
  }
}
