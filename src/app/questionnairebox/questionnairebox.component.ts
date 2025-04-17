import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestService } from '../@service/quest.service';

interface QuesIdAnswerVo {
  quesId: number;
  answers: string[];
}

interface FillinReq {
  quizId: number;
  name: string;
  phone: string;
  email: string;
  age?: number;
  quesIdAnswerList?: QuesIdAnswerVo[]; // 后端允许为空
}

@Component({
  selector: 'app-questionnairebox',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './questionnairebox.component.html',
  styleUrl: './questionnairebox.component.scss'
})
export class QuestionnaireboxComponent implements OnInit{

//接收到的資料
sDate!:String;
eDate!:String;
title!:String;
explain!:String;
quizId!:number;

 // 用戶基本信息
 user_name: string = '';
 phone: string = '';
 email: string = '';
 age: number | null = null;

 // 問卷數據
 quizData: any = null;
 questions: any[] = [];

 // 當前問卷ID
 quiz_id: number | null = null;

 constructor(
   private http: HttpClient,
   private route: ActivatedRoute,
   private router: Router,
   public questService: QuestService
 ) {}

 ngOnInit(): void {
   // 從路由參數獲取問卷ID
    const quiz = this.questService.quest.quizList[0];

    this.title = quiz.name;
    this.explain = quiz.description;
    this.sDate = quiz.startDate;
    this.eDate = quiz.endDate;
    this.route.params.subscribe(params => {
     this.quiz_id = +params['id'];  // "+" 將字符串轉為數字
     console.log('獲取到的問卷ID:', this.quiz_id);
     this.loadQuizData(); // 加載該問卷的詳細內容

   });
 }

 // 方法1: 獲取特定ID的問卷資料
 loadQuizData(): void {
     // 這裡調用您的服務獲取問卷詳細數據
     console.log('正在加載問卷ID:', this.quiz_id);
     if (!this.quiz_id) {
      console.error('無效的問卷ID');
      return;
    }

    this.http.get(`http://localhost:8080/quiz/get_by_quiz_id?quizId=${this.quiz_id}`).subscribe({
       next: (response: any) => {
        console.log('API 數據:', response);
      this.quizData = response;
           // 將 API 的 questionList 轉換為前端需要的格式
      this.questions = response.questionList.map((q: any) => ({

        id: q.quesId,
        text: q.name,
        type: this.normalizeQuestionType(q.type),
        required: q.must,
        options: this.parseOptions(q.options),  // 解析選項字符串
        answer: '',
        selectedOptions: []
      }));
    },
    error: (err) => {
      console.error('獲取問卷失敗:', err);
    }
  });
}
  // 新增方法：解析選項字符串為數組
private parseOptions(options: string | any[]): any[] {
  if (Array.isArray(options)) return options;  // 已經是數組則直接返回
  try {
    return JSON.parse(options);  // 嘗試解析字符串
  } catch (e) {
    console.error('解析選項失敗:', e);
    return [];  // 解析失敗返回空數組
  }
}

  // 統一轉換問題類型為大寫格式
private normalizeQuestionType(type: string): string {
  const typeMap: Record<string, string> = {
    single: 'SINGLE',
    multi: 'MULTIPLE',
    text: 'TEXT'
  };
  return typeMap[type.toLowerCase()] || 'SINGLE'; // 默認為單選
}

  // 取消方法
  cancelQuiz(): void {
    if (confirm('確定要取消填寫嗎？未提交的資料將遺失。')) {
      this.router.navigate(['/homepage']); // 導回首頁
    }
  }

  // ✅ 將資料匯入資料庫
submitQuiz(): void {
  // 👉 先驗證使用者基本資訊和所有必填題目是否有填寫
  if (!this.validateForm()) return;

  // 👉 整理每一題的作答內容，建立一個 quesIdAnswerList 陣列
  const quesIdAnswerList = this.questions
    .map(q => {
      let answers: string[] = [];

      // 📝 文字題：將使用者輸入文字包裝成陣列
      if (q.type === 'TEXT') {
        answers = [q.answer || ''];
      }

      // 🔘 單選題：如果有選項，放入陣列
      else if (q.type === 'SINGLE') {
        answers = q.answer ? [q.answer] : [];
      }

      // ✅ 多選題：直接使用使用者選擇的多個選項陣列
      else if (q.type === 'MULTIPLE') {
        answers = q.selectedOptions || [];
      }

      // 回傳該題的題目ID和回答內容
      return {
        quesId: q.id,
        answers
      };
    })
    .filter(item => item.answers.length > 0);  // 🚫 過濾掉沒有作答的題目

  // ✉️ 組裝整份問卷要送出的資料結構
  const submissionData: FillinReq = {
    quizId: this.quiz_id!,     // 問卷ID
    name: this.user_name,      // 使用者姓名
    phone: this.phone,         // 電話
    email: this.email,         // 信箱
    ...(this.age && { age: this.age }), // 👉 如果有年齡再加入（可選）
    quesIdAnswerList: quesIdAnswerList  // 每題的作答內容
  };

  // 🖨️ 印出送出的資料（開發除錯用）
  console.log('送出資料:', JSON.stringify(submissionData, null, 2));

  // 📡 使用 Angular HttpClient 發送 POST 請求給後端
  this.http.post("http://localhost:8080/quiz/fillin", submissionData).subscribe({
    // 成功送出
    next: (res) => {
      console.log('成功:', res);
      alert('提交成功！');
      this.router.navigate(['/homepage']);  // 導回首頁
    },
    // 發生錯誤
    error: (err) => {
      console.error('錯誤:', err);
      alert(`提交失敗: ${err.error?.message || '請檢查控制台獲取詳細信息'}`);
    }
  });
}


// ✅ 驗證使用者資料與必填題目是否有填寫
validateForm(): boolean {
  // 👤 驗證使用者基本資料是否有填寫
  if (!this.user_name || !this.phone || !this.email) {
    alert('姓名、電話和信箱為必填項！');
    return false;
  }

  // 🔍 檢查每一題是否有填寫（僅檢查 required 的題目）
  for (const q of this.questions) {
    // 根據題型確認是否有填答
    const hasAnswer = q.type === 'TEXT'
      ? !!q.answer  // 文字題有填東西
      : (q.type === 'SINGLE'
          ? !!q.answer  // 單選題有選擇
          : q.selectedOptions?.length > 0);  // 多選題有選擇至少一個

    // ❗如果是必填題但沒填，跳出警告並阻止送出
    if (q.required && !hasAnswer) {
      alert(`請回答問題: ${q.text}`);
      return false;
    }
  }

  return true;  // ✅ 全部檢查都通過
}


// 🔁 多選題的選項切換邏輯（勾選/取消勾選）
toggleOption(question: any, option: any): void {
  const index = question.selectedOptions.indexOf(option);
  if (index === -1) {
    // 如果還沒選中這個選項，就加入陣列
    question.selectedOptions.push(option);
  } else {
    // 如果已經選了，就從陣列中移除（取消勾選）
    question.selectedOptions.splice(index, 1);
  }
}

}

