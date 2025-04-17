import { QuizService } from './../../../@http-services/quiz.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, TooltipItem } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  feedbackData: FeedbackData | null = null;
  quizName: string = '';
  description: string = '';
  questionStats: QuestionStat[] = [];
  errorMessage: string = '';
  charts: Chart[] = [];
  Test:any;

  constructor(
    private router: Router,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.Test = this.quizService.feekbackcount;
    this.loadFeedbackData();
  }

  private loadFeedbackData(): void {
    this.feedbackData = this.quizService.feekbackcount;
    ;
    console.log('原始反饋數據:', this.feedbackData);

    if (!this.feedbackData) {
      this.errorMessage = '無法載入數據';
      return;
    }

    this.quizName = this.Test.quizName;
    this.description = this.feedbackData.description || '';

    if (!this.feedbackData.statisticsVoList || this.feedbackData.statisticsVoList.length === 0) {
      this.errorMessage = '沒有可用的反饋數據';
      console.warn('statisticsVoList為空或未定義');
      return;
    }

    this.processAnswerStatistics();
    console.log('處理後的問題統計:', this.questionStats);
  }

  private processAnswerStatistics(): void {
    this.questionStats = this.feedbackData!.statisticsVoList.map(question => ({
      quesId: question.quesId,
      quesName: question.quesName,
      type: question.type,
      must: question.must,
      answers: question.optionCountVoList
        .filter(option => option.count > 0) // 過濾掉計數為0的選項
        .map(option => ({
          answer: option.option,
          count: option.count
        }))
        .sort((a, b) => b.count - a.count) // 按選擇次數降序排列
    }));
  }

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  getTotalCount(answers: Answer[]): number {
    return answers.reduce((total, item) => total + item.count, 0);
  }

  getPercentage(count: number, total: number): string {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0';
  }

  private renderCharts(): void {
    // 先銷毀舊圖表
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    // 為每個問題創建圖表
    this.questionStats.forEach((question, index) => {
      const canvas = document.getElementById(`chart-${index}`) as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const total = this.getTotalCount(question.answers);

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: question.answers.map(item => `${item.answer} (${this.getPercentage(item.count, total)}%)`),
          datasets: [{
            data: question.answers.map(item => item.count),
            backgroundColor: this.generateColors(question.answers.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              callbacks: {
                label: (context: TooltipItem<'pie'>) => {
                  const value = context.raw as number;
                  const percentage = this.getPercentage(value, total);
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });

      this.charts.push(chart);
    });
  }

  private generateColors(count: number): string[] {
    const colors = [];
    const hueStep = 360 / count;

    for (let i = 0; i < count; i++) {
      const hue = i * hueStep;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }

    return colors;
  }
}

// 類型定義
interface FeedbackData {
  code: number;
  message: string;
  quizName?: string;
  description?: string;
  statisticsVoList: QuestionVo[];
}

interface QuestionVo {
  quesId: number;
  quesName: string;
  type: 'single' | 'multi';
  must: boolean;
  optionCountVoList: OptionCount[];
}

interface OptionCount {
  option: string;
  count: number;
}

interface QuestionStat {
  quesId: number;
  quesName: string;
  type: 'single' | 'multi';
  must: boolean;
  answers: Answer[];
}

interface Answer {
  answer: string;
  count: number;
}
