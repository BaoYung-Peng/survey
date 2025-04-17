import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { QuestService } from '../../../@service/quest.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-create-quest-option',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './create-quest-option.component.html',
  styleUrl: './create-quest-option.component.scss'
})
export class CreateQuestOptionComponent {
  readonly dialog = inject(MatDialog);
  questName!: string;
  needCheckBox: boolean = false;
  // 多選M 單選Q 文字輸入T
  questStats: string = 'Q';
  questArray!: Array<any>;
  saveQuestArray: Array<any> = [];
  questId = 0;
  questOptionId = 0;
  isEdit = false;
  editId = 0;

  constructor(
    private router: Router,
    private questService: QuestService,
  ) { }

  ngOnInit(): void {
    console.log(this.questService.questData);
    // if (this.questService.questData.questArray) {
    //   this.tridyData();
    // }
  }


  tridyData() {
    for (let quest of this.questService.questData.questArray) {
      let newQuestArray = [];
      for (let option of quest.options) {
        newQuestArray.push({
          quest: option.optionName,
          id: option.code
        })
      }

      this.saveQuestArray.push({
        id: quest.questId,
        questName: quest.questName,
        need: quest.need,
        checkBox: false,
        questStats: quest.type,
        questStatsName: this.getQuestStatsName(quest.type),
        questArray: newQuestArray
      });
    }
  }

  // 開啟Dialog需帶入此問題的類型與編輯時需帶入編輯問題ID
  openDialog(type: string, editId?: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { type: type, saveQuestArray: this.saveQuestArray, isEdit: this.isEdit, editId },
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      // 判斷有沒有回傳內容
      // 有的話再去做判斷新增內容或者編輯
      if (result) {
        if (!this.isEdit) {
          this.saveQuestArray = result;
        }
        this.pushQuestArrat();
      }
    });
  }

  saveQuest() {
    if (this.questName) {
      let questStatsName = this.getQuestStatsName(this.questStats);

      if (this.questStats != 'T') {
        for (let questArray of this.questArray) {
          if (questArray.quest.length == 0) {
            alert('選項名稱不能為空');
            return;
          }
        }
      }

      // 判斷不是編輯(!this.isEdit)執行新增(push)
      // 判斷是編輯(this.isEdit)執行資料更新
      if (!this.isEdit) {
        this.saveQuestArray.push({
          id: this.questId,
          questName: this.questName,
          need: this.needCheckBox,
          checkBox: false,
          questStats: this.questStats,
          questStatsName: questStatsName,
          questArray: this.questArray
        });
        this.questId++;
      } else {
        let editData;
        for (let quest of this.saveQuestArray) {
          if (quest.id == this.editId) editData = quest;
        }
        editData.questName = this.questName;
        editData.questStats = this.questStats;
        editData.questStatsName = questStatsName;
        editData.questArray = this.questArray;
        editData.need = this.needCheckBox;
        this.isEdit = false;
      }
      // 資料新增完後將資料重置與塞進service中
      this.pushQuestArrat();
    } else {
      alert('問卷名稱不能為空');
    }
  }

  del() {
    // 判斷如果當前選項有溝選擇,選擇刪除
    for (let i = this.saveQuestArray.length - 1; i >= 0; i--) {
      if (this.saveQuestArray[i].checkBox) {
        this.saveQuestArray.splice(i, 1);
      }
    }
    this.pushQuestArrat();
  }

  getQuestStatsName(type: string): string {
    if (type == 'M') return '多選';
    if (type == 'Q') return '單選';
    if (type == 'T') return '文字';
    return '';
  }

  edit(quset: any) {
    this.isEdit = true;
    this.openDialog(quset.questStats, quset.id)
  }

  pushQuestArrat() {
    let newQuestArray = [];
    for (let quest of this.saveQuestArray) {
      let newOption = [];
      if (quest.questStats != 'T') {
        for (let array of quest.questArray) {
          newOption.push({
            optionName: array.quest,
            code: array.id
          })
        }
      }
      newQuestArray.push({
        questId: quest.id,
        need: quest.need,
        questName: quest.questName,
        type: quest.questStats,
        options: newOption
      })
    }

    let quest = {
      title: this.questService.questData.title,
      sDate: this.questService.questData.sDate,
      eDate: this.questService.questData.eDate,
      explain: this.questService.questData.explain,
      questArray: newQuestArray
    }

    this.questService.questData = quest;
  }

  goback(){
    this.router.navigate(['/tabnavigation/createquest']);
  }

  goPreview() {

    this.pushQuestArrat();
    console.log(this.questService.questData);

    this.router.navigate(['/tabnavigation/questionnaire']);
  }
}
