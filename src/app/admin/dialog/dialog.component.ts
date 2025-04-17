import { Component,inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  // 多選M 單選Q 文字輸入T
  questStats: string = 'Q';
  questArray!: Array<any>;
  questOptionId = 0;
  questName!: string;
  isEdit = false;
  needCheckBox = false;
  saveQuestArray: Array<any> = [];
  questId = 0;
  editId = 0;

  ngOnInit(): void {
    this.saveQuestArray = this.data.saveQuestArray;
    this.isEdit = this.data.isEdit;
    this.questStats = this.data.type;
    this.editId = this.data.editId;
    if (this.isEdit) {
      for (let questArray of this.saveQuestArray) {
        if (questArray.id == this.data.editId) {
          this.questName = questArray.questName;
          this.needCheckBox = questArray.need;
          this.questStats = questArray.questStats;
          this.questArray = questArray.questArray;
        }
      }
    } else {
      for (let questArray of  this.saveQuestArray) {
        this.questId = questArray.id;
      }
      this.questId++;
      //  問題類型是單選或多選，初始化選項陣列{
      if (this.questStats != 'T') this.resertQuestArray();
    }
  }

  resertQuestArray() {
    // 初始設定預設兩個選項
    this.questOptionId = 1;
    this.questArray = [
      { id: 0, quest: '' },
      { id: 1, quest: '' }
    ];
  }
  // 刪除
  rmQuest(index: number) {
    if (this.questArray.length > 1) {
      this.questArray.splice(index, 1);
    }
  }

  addQuest() {
    //  每次新增選項時，將 questOptionId 遞增 1，確保每個選項的 ID 是唯一的
    this.questOptionId++;
    //  questArray 是一個陣列，用來儲存問題的選項。
    //  使用 push() 方法，將一個新的選項物件加入 questArray 中。
    //  新增的選項物件包含兩個屬性：
    //  id：選項的唯一 ID，值為遞增後的 questOptionId。
    //  quest：選項的內容，初始值為空字串 ''。
    this.questArray.push(
      { id: this.questOptionId, quest: '' }
    );
  }

  getQuestStatsName(type: string): string {
    if (type == 'M') return '多選';
    if (type == 'Q') return '單選';
    if (type == 'T') return '文字';
    return '';
  }

  changeSelect() {
    if (this.questStats != 'T') {
      this.resertQuestArray();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close();
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
      this.dialogRef.close(this.saveQuestArray);
    } else {
      alert('問卷名稱不能為空');
    }
  }
}
