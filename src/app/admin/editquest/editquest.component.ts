import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Quiz {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  questions: Question[];
}

interface Question {
  quizId: number;
  quesId: number;
  name: string;
  type: 'Text' | 'Multi' | 'Single';
  must: boolean;
  options: QuestionOption[] | null;
}

interface QuestionOption {
  text: string;
  selected: boolean;
}

@Component({
  selector: 'app-editquest',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './editquest.component.html',
  styleUrls: ['./editquest.component.scss']
})
export class EditquestComponent {
  formData = {
    id: null as number | null,
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    questions: [] as any[]
  };
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route ID:', id);

    if (id && !isNaN(Number(id))) {
      this.loadQuizData(Number(id));
    } else {
      console.error('Invalid ID in route');
      this.handleInvalidAccess();
    }
  }

  private loadQuizData(id: number): void {
    console.log('Loading quiz data for ID:', id);
    this.isLoading = true;

    this.http.post('http://localhost:8080/quiz/getById', { id }).subscribe({
      next: (response: any) => {
        console.log('Quiz data response:', response);

        if (this.validateQuizData(response)) {
          const quizData = response.quizList[0];
          console.log('Quiz data:', quizData);

          this.formData = {
            id: quizData.id || null,
            name: quizData.name || '',
            description: quizData.description || '',
            startDate: quizData.startDate || '',
            endDate: quizData.endDate || '',
            questions: []
          };

          console.log('Form data initialized:', this.formData);
          this.loadQuizQuestions(quizData.id!);
        } else {
          console.error('Invalid quiz data format');
          this.handleInvalidData();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load quiz:', err);
        this.handleLoadError();
        this.isLoading = false;
      }
    });
  }

  private loadQuizQuestions(quizId: number): void {
    console.log('Loading questions for quiz ID:', quizId);

    this.http.get(`http://localhost:8080/quiz/get_by_quiz_id?quizId=${quizId}`)
      .subscribe({
        next: (response: any) => {
          console.log('Questions response:', response);

          if (response?.code === 200) {
            this.formData.questions = response.questionList.map((q: any) => ({
              ...q,
              name: q.name || q.title || '', // 處理可能的欄位名稱不一致
              options: this.parseQuestionOptions(q.options),
              answer: q.answer || ''
            }));

            console.log('Questions loaded:', this.formData.questions);
          } else {
            console.error('Failed to get questions');
            this.snackBar.open('無法獲取題目資料', '關閉', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Failed to load questions:', err);
          this.snackBar.open('題目資料載入失敗', '關閉', { duration: 3000 });
        }
      });
  }

  private parseQuestionOptions(options: any): any[] {
    if (!options) return [];

    try {
      if (typeof options === 'string') {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed)
          ? parsed.map(opt => typeof opt === 'string' ? { text: opt, selected: false } : opt)
          : [];
      }
      return options;
    } catch (e) {
      console.error('Error parsing options:', e);
      return [];
    }
  }

  private validateQuizData(data: any): boolean {
    const isValid = data?.code === 200 && Array.isArray(data?.quizList) && data.quizList.length > 0;
    console.log('Is quiz data valid?', isValid);
    return isValid;
  }

  saveChanges(): void {
    console.log('Attempting to save changes...');
    console.log('Current form data:', JSON.stringify(this.formData, null, 2));

    if (!this.formData.name.trim()) {
      console.warn('Questionnaire name is empty');
      this.snackBar.open('請填寫問卷名稱', '關閉');
      return;
    }

    this.isLoading = true;

    const dataToSave = {
      id: this.formData.id,
      name: this.formData.name,
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
      description: this.formData.description,
      published: false,
      questionList: this.formData.questions.map((q) => ({
        quizId: this.formData.id,
        quesId: q.quesId,
        name: q.name,
        type: q.type,
        must: q.must || false,
        options: this.formatOptionsForBackend(q)
      }))
    };
    console.log(dataToSave);

    // console.log('Data to be saved:', JSON.stringify(dataToSave, null, 2));

    this.http.post('http://localhost:8080/quiz/update', dataToSave).subscribe({
      next: (res) => {
        console.log('Save successful:', res);
        this.snackBar.open('修改已儲存', '關閉', { duration: 3000 });
        this.router.navigate(['/homepagead']);
      },
      error: (err) => {
        console.error('Save failed:', err);
        this.snackBar.open('儲存失敗: ' + err.message, '關閉');
        this.isLoading = false;
      }
    });
  }

  private formatOptionsForBackend(question: any): any {
    console.log('Formatting options for question:', question);

    if (question.type === 'Text') {
      console.log('Text question - options set to null');
      return null;
    }

    if (!question.options || !Array.isArray(question.options)) {
      console.warn('No options array - returning empty array');
      return JSON.stringify([]);
    }

    const formattedOptions = question.options.map((opt: any) => {
      if (typeof opt === 'string') {
        return opt;
      }
      return opt.text || '';
    });

    console.log('Formatted options:', formattedOptions);
    return JSON.stringify(formattedOptions);
  }

  cancelEdit(): void {
    console.log('Cancel edit requested');
    if (confirm('確定要放棄修改嗎？')) {
      this.router.navigate(['/homepagead']);
    }
  }

  addOption(questionIndex: number): void {
    console.log('Adding option to question at index:', questionIndex);

    if (!this.formData.questions[questionIndex].options) {
      this.formData.questions[questionIndex].options = [];
    }

    this.formData.questions[questionIndex].options.push({
      text: '',
      selected: false
    });

    console.log('Updated options:', this.formData.questions[questionIndex].options);
  }

  addQuestion(): void {
    console.log('Adding new question');

    const newQuestion = {
      quizId: this.formData.id || 0,
      quesId: 0,
      name: `問題 ${this.formData.questions.length + 1}`,
      type: 'Single' as const,
      must: false,
      options: [] as QuestionOption[],
    };

    this.formData.questions.push(newQuestion);
    console.log('New question added. Total questions:', this.formData.questions.length);
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    console.log(`Removing option ${optionIndex} from question ${questionIndex}`);

    if (this.formData.questions[questionIndex] && this.formData.questions[questionIndex].options) {
      this.formData.questions[questionIndex].options.splice(optionIndex, 1);
      console.log('Option removed. Remaining options:',
        this.formData.questions[questionIndex].options);
    } else {
      console.warn('Invalid question or options array');
    }
  }

  private handleInvalidAccess(): void {
    console.error('Invalid access detected');
    this.snackBar.open('無效的訪問方式', '關閉', { duration: 5000 });
    this.router.navigate(['/homepagead']);
  }

  private handleInvalidData(): void {
    console.error('Invalid data format');
    this.snackBar.open('問卷資料格式不正確', '關閉', { duration: 5000 });
    this.router.navigate(['/homepagead']);
  }

  private handleLoadError(): void {
    console.error('Data load error');
    this.snackBar.open('資料載入失敗', '關閉', { duration: 5000 });
    this.router.navigate(['/homepagead']);
  }
}
