import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { CreatequestComponent } from './admin/tab-navigation/createquest/createquest.component';
import { CreateQuestOptionComponent } from './admin/tab-navigation/create-quest-option/create-quest-option.component';
import { DialogComponent } from './admin/dialog/dialog.component';
import { MatTableComponent } from './admin/mat-table/mat-table.component';
import { TabNavigationComponent } from './admin/tab-navigation/tab-navigation.component';
import { QuestionnaireboxComponent } from './questionnairebox/questionnairebox.component';
import { QuestionnaireComponent } from './questionnairebox/questionnaire/questionnaire.component';
import { PreviewPageComponent } from './questionnairebox/preview-page/preview-page.component';
import { MemberLoginComponent } from './member-login/member-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { HomepageAdComponent } from './admin/homepage-ad/homepage-ad.component';
import { FeedbackComponent } from './admin/tab-navigation/feedback/feedback.component';
import { FeedbackDetailComponent } from './admin/feedback-detail/feedback-detail.component';
import { EditquestComponent } from './admin/editquest/editquest.component';
import { StatisticsComponent } from './admin/tab-navigation/statistics/statistics.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, //Login頁面
  { path: 'memberlogin', component: MemberLoginComponent }, //會員登入頁面
  { path: 'forgotpassword', component: ForgotPasswordComponent },  //忘記密碼頁面
  { path: 'register', component: RegisterComponent }, //註冊會員頁面
  { path: 'homepage', component: HomepageComponent }, // 首頁
  { path: 'homepagead', component: HomepageAdComponent }, // 管理者首頁
  { path: 'dialog', component: DialogComponent  }, // 彈出視窗頁面
  { path: 'mattable', component: MatTableComponent  }, //表單格式設計
  { path: 'previewpage', component: PreviewPageComponent }, // 預覽頁面
  { path: 'tabnavigation',component:  TabNavigationComponent, //標籤式導航
    children:[
      { path: 'createquest',component:  CreatequestComponent  }, //新增問卷
      { path: 'createquestoption',component: CreateQuestOptionComponent }, //新增問卷選項
      { path: 'feedback/:id', component: FeedbackComponent}, //使用者回饋內容
      { path: 'questionnaire', component: QuestionnaireComponent }, // 問卷測試頁
      { path: 'statistics/:quizId', component: StatisticsComponent }, //統計頁
      ]
  },
  { path: 'questionnairebox/:id', component:  QuestionnaireboxComponent }, //使用者問卷填寫頁面
  { path: 'feedback-detail/:quizId/:index', component: FeedbackDetailComponent } ,//管理者查看使用者回饋內容
  { path: 'editquest/:id', component:  EditquestComponent }, //管理者修改基本資料頁面
  { path: '', redirectTo: 'homepage', pathMatch: 'full' }, // 預設首頁指向 /homepage
];


  // { path: 'myLogo',component:AnswerMyLogoComponent }, //myLogo頁面
  // { path: 'customer', component: AnswerCustomerComponent}, //Customer頁面
  // { path: 'confirm', component: QuestionnaireConfirmComponent }, //Customer=>確認頁
  // { path: 'confirm2',component: QuestionnaireConfirm2Component  },  //myLogo=>確認頁2

