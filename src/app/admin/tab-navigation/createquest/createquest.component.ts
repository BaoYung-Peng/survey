import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateService } from '../../../@service/date.service';
import { QuestService } from '../../../@service/quest.service';
import { MatButtonModule } from '@angular/material/button';

// interface QuizRequest {
//   name: string;
//   description: string;
//   start_date: string;
//   end_date: string;
//   is_published: boolean;
// }

// interface QuizLocalData {
//   title: string;
//   explain: string;
//   sDate: string;
//   eDate: string;
// }

@Component({
  selector: 'app-createquest',
  imports: [
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './createquest.component.html',
  styleUrl: './createquest.component.scss'
})
export class CreatequestComponent {
  questName!: string;
  questExplain!: string;
  sDate!: string;
  eDate!: string;
  minDate!: string;
  maxDate!: string;
  eMaxDate!: string;

  constructor(
    private dateService: DateService,
    private router: Router,
    private questService: QuestService,
  ) { }

  ngOnInit(): void {
    // 設定選取日期最小值為當天
    this.minDate = this.dateService.changeDateFormat(new Date());
    // 範例：如果當前日期是 2023-10-05，加上 30 天後會返回 2023-11-04。
    this.maxDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(), 30));
    if (this.questService.questData?.title) {
      this.questName = this.questService.questData.title;
      this.sDate = this.questService.questData.sDate;
      this.eDate = this.questService.questData.eDate;
      this.questExplain = this.questService.questData.explain;
    }
  }

  // changeSDate() {
  //   this.eMaxDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(this.sDate), 30));
  // }

  cancel()  {
    this.router.navigate(['/homepagead']);
  }
  goNextTab() {
    if (!this.questService.questData) {
      this.questService.questData = {
        title: this.questName,
        sDate: this.sDate,
        eDate: this.eDate,
        explain: this.questExplain
      }
    }
    this.router.navigate(['/tabnavigation/createquestoption']);

  }
}
