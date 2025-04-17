import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class QuestService {

  private editingQuiz: { id: number, data: any } | null = null;
  private apiUrl = 'http://localhost:8080/quiz'; // 後端 API 基礎路徑

  public feedbackCount: any; // ✅ 改正拼字

  constructor(private http: HttpClient) { }
  quizName!:String;
  questData!: any;
  questState!: string;
  quest!:any;

  setEditingQuiz(quiz: { id: number, data: any }): void {
    this.editingQuiz = quiz;
  }

  getEditingQuiz(): { id: number, data: any } | null {
    const quiz = this.editingQuiz;
    this.editingQuiz = null; // 取用後清除
    return quiz;
  }

  getQuizById(quizId: number): Promise<any> {
    return this.http.post(`${this.apiUrl}/getById`, { id: quizId }).toPromise();
  }
}

// 定義問卷的狀態枚舉
export enum QuestState {
  P = 'P',           // 問卷已發布
  N = 'N',           // 問卷未發布
  E = 'E',           // 問卷已過期
  S = 'S',           // 問卷已結束
  CreateQuest = 'createquest',  // 創建問卷狀態
  Empty = ''         // 空狀態
}

