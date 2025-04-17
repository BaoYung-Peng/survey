import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire-statistics',
  imports: [
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './questionnaire-statistics.component.html',
  styleUrl: './questionnaire-statistics.component.scss'
})
export class QuestionnaireStatisticsComponent {
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];


  constructor(private router: Router){ }

  back(){
    this.router.navigate(['/homepage']);
  }

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  remove() {
    if (this.links.length > 0) {
      this.links.splice(this.links.length - 1, 1);
  }
}
  selected = 'option2';

ngOnInit(): void {
  // 獲取 canvas 元素
let ctx = document.getElementById('chart') as HTMLCanvasElement;

// 設定數據
let data = {
// x 軸文字
labels: ['餐費', '交通費', '租金'],
datasets: [
  {
    // 上方分類文字
    label: '支出比',
    // 數據
    data: [12000, 3000, 9000],
    // 線與邊框顏色
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)',
    ],
    //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
    hoverOffset: 4,
  },
],
};

// 創建圖表
let chart = new Chart(ctx, {
//pie是圓餅圖,doughnut是環狀圖
type: 'pie',
data: data,
});

}
ngAfterViewInit(): void {
//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
//Add 'implements AfterViewInit' to the class.
for(let chartdata of this.chartArray){
  let ctx= document.getElementById(chartdata.id) as HTMLCanvasElement;
  console.log(ctx);

  let data = {
    lables: chartdata.lable,
    datasets:[
      {
        lable:"支出比",
        data:chartdata.data,
        backgroundColor:chartdata.backgroundColor,
        hoverOffset:4

      }
    ]
  }
  let chart = new Chart(ctx, {
    //pie是圓餅圖,doughnut是環狀圖
    type: 'pie',
    data: data,
  });
}
}

  chartArray = [
    {
      id:'a',
      lable: ['服務', '是否是男生'],
      data: [20, 25],
      backgroundColor: ['rgb(54, 162, 235)','rgb(255, 205, 86)',]
    },
    {
      id:'b',
      lable: ['套餐A', '套餐B', '套餐C'],
      data: [2, 50, 25],
      backgroundColor: ['rgb(255, 99, 132)','rgb(255, 205, 86)','rgb(9, 213, 13)',]
    },
  ]
}
