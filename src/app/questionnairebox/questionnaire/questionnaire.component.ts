import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { QuestService } from '../../@service/quest.service';
import { UserService } from '../../@service/user.service';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit {
newQuestArray: Array<any> = [];
radioData!: string;
ngclassBoolean = false;
userName!: string;
userPhone!: string;
userEmail!: string;
userAge!: string;
title!: string;
sDate!: string;
eDate!: string;
explain!: string;
isAdmin = false;

constructor(
  private questService: QuestService,
  private router: Router,
  private userService: UserService,
) { }

ngOnInit(): void {
  this.isAdmin = this.userService.isAdmin;
  this.title = this.questService.questData.title;
  this.sDate = this.questService.questData.sDate;
  this.eDate = this.questService.questData.eDate;
  this.explain = this.questService.questData.explain;
  // 當我們判斷service中沒有這個資料 就等於不是從預覽回來需要重新組合資料  // 如果沒有暫存的問卷資料，則重新整理問卷選項
  if (!this.questService.questData) {
    this.tidyQuestArray();
  } else {
    // 當有資料的話就要將使用者的資料塞進欄位    // 如果有暫存的問卷資料，則將資料填入表單
    this.title = this.questService.questData.title;
    this.sDate = this.questService.questData.sDate;
    this.eDate = this.questService.questData.eDate;
    this.explain = this.questService.questData.explain;
    this.userName = this.questService.questData.userName;
    this.userPhone = this.questService.questData.userPhone;
    this.userEmail = this.questService.questData.userEmail;
    this.userAge = this.questService.questData.userAge;
    this.newQuestArray = this.questService.questData.questArray;
  }
}

tidyQuestArray() {
  // 在每一筆資料裡面加入兩個欄位answer跟radioAnswer
  // 分別拿來給文字輸入(answer)跟單選(radioAnswer)放他的答案
  for (let array of this.questService.questData.questArray) {
    this.newQuestArray.push({ ...array, answer: '', radioAnswer: '' });
    // 上者等於下者寫法
    // this.newQuestArray.push({
    //   questId: array.questId,
    //   need: array.need,
    //   questName: array.questName,
    //   type: array.type,
    //   options: array.options,
    //   answer: '',
    //   radioAnswer: '' });
  }

  // 在問題的選擇中加入boxBoolean讓checkbox去進行資料綁定
  for (let newArray of this.newQuestArray) {
    let options = [];
    for (let option of newArray.options) {
      options.push({ ...option, boxBoolean: false });
    }
    newArray.options = options;
  }

}

goPreview() {
  // 檢查必填欄位是否填寫
  if (this.checkNeed()) {
    // 將資料打包並存到 questService.questData
    this.questService.questData = {
      title: this.questService.questData.title,
      sDate: this.questService.questData.sDate,
      eDate: this.questService.questData.eDate,
      explain: this.questService.questData.explain,
      userName: this.userName,
      userPhone: this.userPhone,
      userEmail: this.userEmail,
      userAge: this.userAge,
      questArray: this.newQuestArray
    }
    // 導航到預覽頁面
    this.router.navigate(['/previewpage']);
  };
}
// 檢查使用者基本資料是否填寫
checkNeed(): boolean {
  if (!this.userName || !this.userPhone) {
    alert('請確認必填皆有填寫');
    return false;
  };

  for (let quest of this.newQuestArray) {
    if (quest.need) {
      // 多選M 單選Q 文字輸入T
      if (quest.type == 'M') {
        let check = false;
        for (let option of quest.options) {
          if (option.boxBoolean) {
            check = true;
          }
        }
        // 多選題（M）
        if (!check) {
          alert('請確認必填皆有填寫');
          return false;
        }
        // 單選題（Q）
      } else if (quest.type == 'Q') {
        if (!quest.radioAnswer) {
          alert('請確認必填皆有填寫');
          return false;
        }
        // 文字輸入題（T）
      } else if (quest.type == 'T') {
        if (!quest.answer) {
          alert('請確認必填皆有填寫');
          return false;
        }
      }
    }
  }
  return true;
}

goBack() {
  this.router.navigate(['/tabnavigation/createquestoption']);
}

save() {
  // this.apiService.saveQuestionnaire(this.questData).subscribe(response => {
  // console.log('資料已保存', response);
  this.questService.questData = null;
  this.router.navigate(['/questionnairead']);
}
}
