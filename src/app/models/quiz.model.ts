// ==================== 基本回應格式 ====================
export interface BasicResponse<T = any> {
  success: boolean;
  code?: number;
  message?: string;
  data?: T;
}

// ==================== 問卷基礎模型 ====================
export interface Quiz {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  explain?: string;
}

// 問卷詳情 (包含問題與統計數據)
export interface QuizWithQuestions extends Quiz {
  title: string;
  explain?: string;
  questions: Question[];
  statistics?: {
    responseCount: number;
    averageTime: number;
  };
  createdAt: string;
}

// 問卷狀態枚舉
export enum QuizStatus {
  DRAFT = '未開始',
  PENDING = '未發布',
  ACTIVE = '進行中',
  ENDED = '已結束'
}

// 帶狀態的問卷
export interface QuizWithStatus extends Quiz {
  status: QuizStatus;
  displayStatus: string;
  statusClass: string;
}

// ==================== 問卷 API 回應格式 ====================
// 分頁回應格式
export interface QuizResponse extends BasicResponse<Quiz[]> {
  content: Quiz[];
  totalElements: number;
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
}

// 取得問卷清單的回應
export interface QuizListResponse extends BasicResponse<Quiz[]> {
code: number;
message: string;
quizList: Quiz[];       // 實際 API 返回的欄位名
totalElements: number;  // 分頁總數
}

// 取得問卷問題的回應
export interface QuestionsResponse extends BasicResponse<Question[]> {
  content: Quiz[];        // 通用分頁結構的數據欄位
  totalElements: number;
}

// ==================== 問卷請求 DTO ====================
// 創建問卷請求
export interface CreateQuizRequest {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  isPublished: boolean;
  questionList: Question[];
}

// 後端對應的結構
export interface SearchRes {
  quizList: Quiz[];
  totalElements: number;
}

export interface SearchQuizParams {
  name?: string;
  startDate?: string;  // YYYY-MM-DD
  endDate?: string;    // YYYY-MM-DD
  page?: number;       // 从0开始
  size?: number;       // 每页数量
}

// 問卷搜尋參數
export interface SearchQuizParams {
  name?: string;
  startDate?: string;  // 格式: YYYY-MM-DD
  endDate?: string;    // 格式: YYYY-MM-DD
  page?: number;       // 從 0 開始
  size?: number;       // 每頁數量
}

// ==================== 問題模型 ====================
export interface Question {
  quizId: number;
  quesId: number;
  name: string;
  type: string;
  isMust: boolean;
  options: string[] | null;
}

// 問題類型枚舉
export enum QuestionType {
  TEXT = 'text',
  SINGLE = 'single',
  MULTI = 'multi'
}
