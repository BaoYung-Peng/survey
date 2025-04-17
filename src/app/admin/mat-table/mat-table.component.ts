import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, Input, output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from '../../@service/user.service';
import { QuestService } from '../../@service/quest.service';

@Component({
  selector: 'app-mat-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
  ],
  templateUrl: './mat-table.component.html',
  styleUrl: './mat-table.component.scss'
})
export class MatTableComponent implements AfterViewInit {
  // @Input() ELEMENT_DATA!: PeriodicElement[];
  @Input() ELEMENT_DATA!: any;
  @Input() quesName!:string;
  displayedColumns: string[] = ['id', 'name', 'status', 'sDate', 'eDate', 'eductId'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectData = output<any[]>()
  isAdmin = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private userService: UserService,
    private questService: QuestService,
  ) { }

//如果是管理者 就在表格上最前面新增一個「選擇」欄位
  ngOnInit(): void {
    // this.isAdmin = this.userService.isAdmin
    // if (this.isAdmin) {
    //   this.displayedColumns.unshift('select');
    // }
    if (true) {
      this.displayedColumns.unshift('select');
    }
    console.log(this.isAdmin);

  }
//---------------------------------------------------------
  setSelectData(event: any) {
    // 处理选中数据的逻辑
    console.log('Selected Data:', event);
  }

  addNewElement(newElement: PeriodicElement) {
    // 新增数据到 ELEMENT_DATA
    this.ELEMENT_DATA.push(newElement);
    // 如果需要触发表格更新，可以在这里调用相关方法
  }
//------------------------------------------------------------
  // 判斷內容變更觸發修改內容
  // checkBox多選重置
  ngOnChanges() {
    this.dataSource.data = this.ELEMENT_DATA;
    this.selection.clear();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel =   "請選擇每頁顯示數量";
    this.dataSource.data = this.ELEMENT_DATA;
  }

  // 檢查所有行都全選中
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // 全選<=>取消全選 切換邏輯
  masterToggle() {
    this.isAllSelected() ? // true or false
      this.selection.clear() : //清除所有選中的行
      this.dataSource.data.forEach(row => this.selection.select(row)); //每一行都加入選中
    this.outputData();
  }
  //  根據條件導航到統計頁面
  gostatistics(element: any) {
    if (element.statusCode == 'E') {
      this.router.navigate(['/statistics']);
    }
  }

  //輸出選中的資料
  outputData() {
    let checkData: Array<any> = [];
    this.selection.selected.forEach(s => checkData.push(s));
    this.selectData.emit(checkData);
  }

  //Tab導航
  goQuestionnaire(element: any) {
    if (this.isAdmin) {
      this.questService.questState = element.statusCode; //將statusCode存到questService.questState
      this.questService.questData = SERVICE_DATA; //將SERVICE_DATA存到questService.questData
      // P:尚未開始 E:已結束 N:未發布 S:進行中
      if (this.questService.questState == 'P' || this.questService.questState == 'N') {
        this.router.navigate(['/tabnavigation/createquest']);
      } else if (this.questService.questState == 'E' || this.questService.questState == 'S') {
        this.router.navigate(['/tabnavigation/fakedata']);
      }
    } else if (element.statusCode == 'S') {
      this.router.navigate(['/questionnaire']);
    }
  }
}

  export interface PeriodicElement {
    position: number;
    status : string;
    name: string;
    sDate: string;
    eDate: string;
    eductId: string;
    statusCode: string;
}

const SERVICE_DATA = {
  title: "問卷名稱",
  sDate: "2024-11-19",
  eDate: "2024-11-29",
  explain: "問卷說明",
  questArray: [
    {
        "questId": 0,
        "need": false,
        "questName": "問題1",
        "type": "Q",
        "options": [
            {
                "optionName": "aa",
                "code": 0
            },
            {
                "optionName": "bb",
                "code": 1
            }
        ]
    },
    {
        "questId": 1,
        "need": true,
        "questName": "問題2",
        "type": "M",
        "options": [
            {
                "optionName": "cc",
                "code": 0
            },
            {
                "optionName": "dd",
                "code": 1
            }
        ]
    },
    {
        "questId": 2,
        "need": false,
        "questName": "問題3",
        "type": "T",
        "options": [
            {
                "optionName": "",
                "code": 0
            },
            {
                "optionName": "",
                "code": 1
            }
        ]
    }
  ],
};
