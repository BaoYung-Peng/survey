import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuestService } from '../../@service/quest.service';
import { QuizService } from '../../@http-services/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preview-page',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './preview-page.component.html',
  styleUrl: './preview-page.component.scss'
})
export class PreviewPageComponent {
  questData: any;
  questArray: any[] = []; // 初始化問題陣列
  isSaving = false;

  constructor(
    private http: HttpClient,
    private questService: QuestService,
    private router: Router,
    private snackBar: MatSnackBar,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.questData = this.questService.questData;
    if (!this.questData) {
      this.snackBar.open('無問卷數據，請重新建立', '關閉', { duration: 3000 });
      this.router.navigate(['/createquiz']);
    }
    console.log(this.questData);

  }

  async publishQuiz(): Promise<void> {
    if (this.isSaving || !this.questData) return;
    this.isSaving = true;

    try {
      this.questArray = []; // 初始化問題陣列（清空舊數據）

      // 遍歷目前的問卷數據，將每個問題轉換為指定格式
      for (let question of this.questData.questArray) {
        let convertedType: string;
        if (question.type === "T") convertedType = "Text";   // "T" -> "Text"（文字輸入題）
        else if (question.type === "Q") convertedType = "single"; // "Q" -> "single"（單選題）
        else if (question.type === "M") convertedType = "multi";  // "M" -> "multi"（多選題）
        else convertedType = question.type; // 其他類型維持不變

        // 建立新的問題物件
        const newQuestion = {
          quesId: question.questId,   // 問題 ID
          name: question.questName,   // 問題名稱
          type: convertedType,        // 轉換後的問題類型
          must: question.need,        // 是否必填（布林值）
          options: convertedType === "Text"
        ? null
        : JSON.stringify(question.options.map((opt: any) => opt.optionName)),
          // 將選項名稱提取後轉為 JSON 字串格式
        };

        this.questArray.push(newQuestion); // 將轉換後的問題物件加入問題陣列
      }

      // 建立要發送到後端的問卷數據
      const questData = {
          name: this.questData.title,
          description: this.questData.explain,
          startDate: this.questData.sDate,
          endDate: this.questData.eDate,
          published:"true",  // 改為 isPublished 並使用布林值而非字串
          questionList: this.questArray.map(question => ({
            ...question,
            options: question.options // 確保選項格式正確
          }))
        };
      console.log(questData); // 在控制台輸出問卷數據（除錯用）


      this.quizService.postApi("http://localhost:8080/quiz/create",questData).subscribe((res:any) => {
        this.questService.questData = null;
        // this.router.navigate(['/homepagead']);
          console.log(res);

      } )
       // 使用 quizService 或直接使用 http
      //   this.http.post("http://localhost:8080/quiz/create", questData, {
      //   headers: { 'Content-Type': 'application/json' }
      // }).toPromise();

    this.snackBar.open('問卷發布成功！', '關閉', { duration: 2000 });
    this.clearAndRedirect();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '未知錯誤';
    this.snackBar.open(`發布失敗: ${errorMsg}`, '關閉', { duration: 5000 });
  } finally {
    this.isSaving = false;
  }
}

  getSelectedOption(question: any): string {
    if (!question.radioAnswer || !question.options) return '無';

    const selectedOption = question.options.find(
      (opt: any) => opt.code === question.radioAnswer
    );

    return selectedOption ? selectedOption.optionName : '無';
  }

  goBack(){
    this.router.navigate(['/tabnavigation/questionnaire']);
  }

  private clearAndRedirect(): void {
    // this.questService.questData = null;
    this.router.navigate(['homepagead']);
  }
}


