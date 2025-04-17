import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../@service/user.service';
import { QuestService } from '../../@service/quest.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QuizService } from '../../@http-services/quiz.service';


// 🏷️ 組件裝飾器，定義元數據
@Component({
  selector: 'app-homepage-ad', // 🔍 組件選擇器
  imports: [
    CommonModule,    // 📌 Angular 常用指令
    FormsModule,     // 📌 表單相關功能
    MatIcon,         // 📌 Material 圖標
    NzIconModule,     // 👈 添加這行

  ],
  templateUrl: './homepage-ad.component.html', // 🎨 模板文件路徑
  styleUrls: ['./homepage-ad.component.scss'] // 🎨 樣式文件路徑
})
export class HomepageAdComponent implements OnInit {

  // 📊 問卷列表數據
  quizList: any[] = [];

  // 🔍 搜尋條件
  searchText: string = '';     // 📌 搜尋關鍵字
  startDate: string = '';      // 📆 開始日期
  endDate: string = '';        // 📆 結束日期

  // 📑 分頁設定
  currentPage: number = 1;     // 📌 當前頁碼
  itemsPerPage: number = 10;   // 📌 每頁顯示數量
  totalItems: number = 0;      // 📌 總項目數

  // ⚙️ 狀態控制變數
  isLoading: boolean = false;  // 🔄 載入狀態
  errorMessage: string = '';   // ❌ 錯誤訊息
  // 新增的變數
  selectedQuizId: number | null = null;

  // 🛠️ 構造函數，注入所需服務
  constructor(
    private http: HttpClient,           // 📡 HTTP 客戶端
    private router: Router,             // 🧭 路由導航
    private userService: UserService,   // 👤 用戶服務
    private questService: QuestService, // 📝 問卷服務
    private quizService: QuizService,
  ) {}

  /**
   * 🔍 查看問卷詳細資訊
   * @param quizId 問卷 ID
   */
  viewDetails(quizId: number): void {
    console.log('查看問卷 ID:', quizId);
    // 🚧 實際應用中通常會導航到詳細頁面
    // 選項2: 使用模板字符串(需用反引號)
    this.router.navigate(['/tabnavigation/feedback', quizId]); // 傳遞問卷 ID
    // this.router.navigate(['/quiz-details', quizId]);
    alert(`即將查看問卷 ${quizId} 的詳細資料`);
    // this.router.navigate(['${quizId}']);
  }

  /**
   * 🏁 初始化組件，載入所有問卷
   */
  ngOnInit(): void {
    this.loadAllQuizzes();
  }

  /**
   * 📥 載入所有問卷數據
   */
  loadAllQuizzes(): void {
    this.isLoading = true;      // 🔄 顯示載入狀態
    this.errorMessage = '';     // ❌ 清空錯誤訊息

    // 📡 發送 GET 請求獲取所有問卷
    this.http.get('http://localhost:8080/quiz/getAll')
      .subscribe({
        next: (response: any) => {
          this.quizList = response.quizList || []; // 📌 獲取問卷列表
          this.totalItems = this.quizList.length;  // 📌 更新總數
          this.isLoading = false;                 // 🔄 關閉載入狀態
        },
        error: (err) => {
          this.errorMessage = '載入數據失敗，請稍後再試';
          this.isLoading = false;
          console.error('API錯誤:', err);
        }
      });
  }

  /**
   * 🔍 執行搜尋功能
   */
  searchQuizzes(): void {
    const params: any = {};  // 📦 初始化搜尋參數

    // 🗓️ 優先處理日期條件
    if (this.startDate || this.endDate) {
      if (this.startDate) params.startDate = this.formatDate(this.startDate);
      if (this.endDate) params.endDate = this.formatDate(this.endDate);

      // 🔤 如果有日期條件，名稱條件變為二次過濾
      if (this.searchText.trim()) {
        params.name = this.searchText.trim();
      }
    }
    // 🔤 僅使用名稱進行搜尋
    else if (this.searchText.trim()) {
      params.name = this.searchText.trim();
    }
    // ⚠️ 若無輸入條件，提示錯誤訊息
    else {
      alert('請至少輸入一個搜尋條件！');
      return;
    }

    console.log('最終搜尋參數:', params);

    // 📤 發送 POST 搜尋請求
    this.http.post('http://localhost:8080/quiz/Search', params)
      .subscribe({
        next: (response: any) => {
          this.processSearchResults(response); // ✅ 處理搜尋結果
        },
        error: (err) => this.handleSearchError(err) // ❌ 錯誤處理
      });
  }

  /**
   * 📆 日期格式化（YYYY-MM-DD）
   * @param date 日期字串或 Date 物件
   * @returns 格式化後的日期字串
   */
  private formatDate(date: string | Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  /**
   * 📊 處理搜尋結果
   * @param response API 回應數據
   */
  private processSearchResults(response: any) {
    if (!response.quizList || response.quizList.length === 0) {
      this.errorMessage = '沒有找到符合條件的問卷';
      this.quizList = [];
    } else {
      this.errorMessage = '';
      this.quizList = response.quizList;

      // 🔍 前端二次過濾（保險措施）
      if (this.searchText.trim()) {
        this.quizList = this.quizList.filter(quiz =>
          quiz.name.includes(this.searchText.trim())
        );
      }
    }
  }

  /**
   * ❌ 搜尋錯誤處理
   * @param err 錯誤物件
   */
  private handleSearchError(err: any) {
    this.errorMessage = '搜尋失敗，請稍後再試';
    console.error('API錯誤詳情:', err);
    this.quizList = [];
  }

  /**
   * 🏷️ 計算問卷狀態
   * @param quiz 問卷物件
   * @returns 狀態文字
   */
  getQuizStatus(quiz: any): string {
    const now = new Date();
    const start = new Date(quiz.startDate);
    const end = new Date(quiz.endDate);

    if (quiz.isPublished) return '未發布';
    if (now < start) return '尚未開始';
    if (now > end) return '已結束';
    return '進行中';
  }

  /**
   * 🔄 重置搜尋條件並載入所有問卷
   */
  resetSearch(): void {
    this.searchText = '';
    this.startDate = '';
    this.endDate = '';
    this.loadAllQuizzes();
  }

  /**
   * ➕ 新增問卷
   */
  addNewQuiz() {
    // 🧹 進入新增前先清空暫存數據
    this.questService.questData = null;
    // 🏷️ 設定操作類型為新增
    this.questService.questState = 'ADD';
    // 🧭 導航到創建問卷頁面
    this.router.navigate(['/tabnavigation/createquest']);
  }

  // 📌 儲存選中的問卷
  selectedQuizzes: { [key: number]: boolean } = {};


  //=======================
  hasSelectedForDelete(): boolean {
    return Object.values(this.selectedQuizzes).some(selected => selected);
  }

  /**
   * ✅ 全選 / 取消全選功能
   * @param event 勾選事件
   */
  toggleAllSelection(event: any) {
    const checked = event.target.checked;
    this.quizList.forEach(quiz => {
      this.selectedQuizzes[quiz.id] = checked;
    });
  }

  /**
   * 🗑️ 批量刪除所選問卷
   */
  deleteSelectedQuizzes() {
    // 🔍 取得被選取的問卷 ID
    const idsToDelete = (Object.keys(this.selectedQuizzes) as Array<`${number}`>)
      .map(id => Number(id))
      .filter(id => this.selectedQuizzes[id]);

    // ⚠️ 檢查是否有選取問卷
    if (idsToDelete.length === 0) {
      alert('請選擇至少一筆問卷來刪除');
      return;
    }

    // ⚠️ 刪除確認對話框
    if (!confirm(`確定要刪除這 ${idsToDelete.length} 筆問卷嗎？`)) {
      return;
    }
    const requestBody = {
      quizIdList: idsToDelete
  };
    console.log(idsToDelete);
    // 📡 發送刪除請求
    this.http.post('http://localhost:8080/quiz/delete', requestBody )
      .subscribe({

        next: () => {
          // 🔄 更新前端列表
          this.quizList = this.quizList.filter(quiz => !idsToDelete.includes(quiz.id.toString()));

          // 🧹 清空已選擇的問卷
          idsToDelete.forEach(id => delete this.selectedQuizzes[+id]);

          // ✅ 顯示成功訊息
          alert('問卷刪除成功！');
        },
        error: (err) => {
          console.error('刪除失敗:', err);
          alert('部分問卷刪除失敗，請稍後再試');
        }
      });
  }

selectQuizForUpdate(quizId: number): void {
  this.selectedQuizId = quizId;
}

updateSelectedQuiz(): void {
  if (this.selectedQuizId !== null) {
    const quizId = this.selectedQuizId;
    this.isLoading = true;

    this.http.post('http://localhost:8080/quiz/getById', { id: quizId })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.code === 200 && response.quizList?.length > 0) {
            // 传递整个API响应和quiz数据
            this.router.navigate(['/editquest', quizId], {
              state: {
                apiResponse: response,  // 完整API响应
                quizData: response.quizList[0]  // 实际的quiz数据
              }
            });
          } else {
            this.handleError('无效的问卷数据格式');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.handleError('API 请求失败', err);
        }
      });
  }
}

// 統一的錯誤處理方法
private handleError(message: string, error?: any): void {
  console.error(message, error);
  alert(message);
  // 可以在此添加更詳細的錯誤處理邏輯
}

  /**
   * 🚪 登出系統
   */
  logout() {
    // 🔄 移除管理者權限
    this.userService.isAdmin = false;
    // 🧭 導航到首頁
    this.router.navigate(['/homepage']);
  }
//查看统计结果
  async viewStatistics(quizId: number) {
  this.quizService.postApi("http://localhost:8080/quiz/statistics", quizId)
  .subscribe((res:any) =>{
    console.log(res);
    this.quizService.feekbackcount = res;
    console.log(this.quizService.feekbackcount);
    this.router.navigate(['/tabnavigation/statistics', quizId])
  })
}
}
