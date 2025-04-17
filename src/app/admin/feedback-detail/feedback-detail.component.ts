import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-detail',
  imports: [
      CommonModule
    ],
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.css']
})
export class FeedbackDetailComponent implements OnInit {
  feedbackData: any;
  selectedUser: any;
  quizInfo: any;
  isLoading = true;
  error: string | null = null;  // 修改這裡，允許 string 或 null
  userIndex: number = -1;
  quizId: number | null = null; // 明確宣告 quizId 屬性

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const quizIdParam = this.route.snapshot.paramMap.get('quizId');
    const indexParam = this.route.snapshot.paramMap.get('index');

    if (quizIdParam !== null && indexParam !== null) {
      this.quizId = +quizIdParam;
      this.userIndex = +indexParam;
      this.fetchFeedbackData();
    } else {
      this.error = '缺少必要參數';
      this.isLoading = false;
    }
  }

   fetchFeedbackData(): void {
    this.http.post('http://localhost:8080/quiz/feedback', { id: this.quizId }).subscribe(
      (data: any) => {
        this.feedbackData = data;
        this.quizInfo = {
          quizName: data.quizName,
          description: data.description
        };

        if (data.feedbackList && data.feedbackList[this.userIndex]) {
          this.selectedUser = data.feedbackList[this.userIndex];
        } else {
          this.error = '找不到指定的使用者回饋';
        }

        this.isLoading = false;
      },
      (error) => {
        this.error = '無法載入問卷詳細資料';
        this.isLoading = false;
        console.error('API錯誤:', error);
      }
    );
  }


}
