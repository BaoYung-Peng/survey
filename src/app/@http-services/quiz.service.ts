import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { BasicResponse, Quiz, SearchRes , CreateQuizRequest, QuizWithQuestions, QuizResponse, SearchQuizParams, QuizListResponse } from '../models/quiz.model';
import { environment } from '../../environments/environment';


// 問卷服務 - 主要處理與問卷相關的API請求
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  feekbackcount!:any;


  // API基礎路徑和緩存相關變量
  private readonly apiUrl = `${environment.apiUrl}/quiz`;
  private quizzesCache$?: Observable<Quiz[]>; // 缓存所有問卷


  constructor(private http: HttpClient) {}

  //讀取
  getApi(url: string){
    return this.http.get(url);
  }
  //新增
  postApi(url: string, postData: any){
    return this.http.post(url, postData);
  }
  //更新
  putApi(url: string, putData: any){
    return this.http.put(url, putData);
  }
  //刪除
  delApi(url: string){
    return this.http.delete(url);
  }

  // ==================== 狀態管理區塊 ====================
  // 用於管理當前編輯的問卷狀態
  private currentQuiz?: QuizWithQuestions;

  /** 設置當前編輯的測驗 */
  setCurrentQuiz(quiz: QuizWithQuestions): void {
    this.currentQuiz = quiz;
  }

  /** 獲取當前編輯的測驗 */
  getCurrentQuiz(): QuizWithQuestions | undefined {
    return this.currentQuiz;
  }

  /** 清除當前問卷狀態 */
  clearCurrentQuiz(): void {
    this.currentQuiz = undefined;
  }

  // ==================== API 方法區塊 ====================
  /**
   * 獲取所有問卷 (帶緩存功能)
   * @param refresh 是否強制刷新緩存
   */
 // ==================== 核心API方法 ====================
 getAllQuizzes(params: any = {}): Observable<{ quizList: Quiz[], totalElements: number }> {
  const httpParams = new HttpParams({ fromObject: params });

  return this.http.get<{
    code: number;
    message: string;
    quizList: Quiz[];
    totalElements: number
  }>(`${this.apiUrl}/getAll`, { params: httpParams }).pipe(
    map(response => {
      if (response.code !== 200) {
        throw new Error(response.message || '獲取數據失敗');
      }
      return {
        quizList: response.quizList,
        totalElements: response.totalElements
      };
    })
  );
}

searchQuizzes(params: SearchQuizParams): Observable<SearchRes> {
  return this.http.post<SearchRes>(
    `${this.apiUrl}/quiz/Search`,
    params,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );
}

deleteQuizzes(ids: number[]): Observable<BasicResponse<void>> {
  return this.http.post<BasicResponse<void>>(`${this.apiUrl}/delete`, { ids })
  .pipe(
    map(response => {
      if (!response.success) {
        throw new Error(response.message || '刪除失敗');
      }
      return response; // 保持 BasicResponse<void> 作為返回值
    }),
    catchError(this.handleError)
  );
}

  // ==================== 私有工具方法區塊 ====================
  /** 處理API響應 (統一處理成功/失敗狀態) */
  private handleResponse<T>(response: BasicResponse<T>, defaultError?: string): T {
    // 添加調試日誌
    console.log('API響應:', response);

    // 更嚴格的成功檢查
    if (response.success !== true || !response.data) {
      throw new Error(response.message || defaultError || '請求失敗');
    }
    return response.data;
  }

  /** 清除緩存 */
  private clearCache(): void {
    this.quizzesCache$ = undefined;
  }

  /** 統一錯誤處理 (處理各種HTTP錯誤情況) */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '發生未知錯誤';

    if (error.status === 0) {
      errorMessage = '網路連接失敗，請檢查網路線路是否正常';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `客戶端錯誤: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message ||
                   error.message ||
                   `服務氣返回 ${error.status}`;
    }

    console.error('API請求錯誤:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

//=====================================================================
getQuizResponses(url: string, body: any): Observable<any> {
  return this.http.post(url, body); // 使用 POST 请求发送数据
}

// 呼叫 API 取得回應資料
getFeedback(): Observable<any> {
  return this.http.get<any>(this.apiUrl);
}
}
