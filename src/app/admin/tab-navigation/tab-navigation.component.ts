import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationEnd, Router, RouterLink, RouterOutlet, ActivatedRoute, RouterModule } from '@angular/router';
import { QuestService } from '../../@service/quest.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-navigation',
  imports: [
    CommonModule,
    MatTabsModule,
    RouterOutlet,
    RouterLink,
    RouterModule
  ],
  templateUrl: './tab-navigation.component.html',
  styleUrl: './tab-navigation.component.scss'
})
export class TabNavigationComponent implements OnDestroy {
  links = [
    {
      path: '/tabnavigation/createquest',
      name: '問卷',
      id: 'createquest'
    },
    {
      path: '/tabnavigation/createquestoption',
      name: '題目',
      id: 'createquestoption'
    },
    {
      path: '/tabnavigation/feedback',
      name: '問卷回饋',
      id: 'feedback',
      requiresId: true
    },
    {
      path: '/tabnavigation/statistics',
      name: '統計',
      id: 'statistics',
      requiresId: true
    },
    {
      path: '/homepagead',
      name: '回列表',
      id: 'home'
    },
  ];

  activeLink = this.links[0];
  private routerSub: Subscription;
  currentQuizId: string | null = null;
  isFeedbackPage = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private questService: QuestService
  ) {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentQuizId();
      this.updatePageState(event.url);
      this.updateActiveLink(event.url);
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private updateCurrentQuizId(): void {
    const childRoute = this.route.firstChild;
    this.currentQuizId = childRoute?.snapshot.params['id'] || null;
  }

  private updatePageState(url: string): void {
    this.isFeedbackPage = url.includes('/feedback');
  }

  private updateActiveLink(url: string): void {
    const matchedLink = this.links.find(link =>
      url.startsWith(link.path) ||
      url.startsWith(link.path + '/')
    );

    if (matchedLink) {
      this.activeLink = matchedLink;
    }
  }

  isTabDisabled(link: any): boolean {
    const currentUrl = this.router.url;

    // 回列表永遠可以點
    if (link.id === 'home') {
      return false;
    }

    // 在新增問卷頁或新增題目頁，只能點這兩個
    if (currentUrl.includes('/createquest') || currentUrl.includes('/createquestoption')) {
      return !(link.id === 'createquest' || link.id === 'createquestoption');
    }

    // 在 feedback 或 statistics 頁，只能點這兩個
    if (currentUrl.includes('/feedback') || currentUrl.includes('/statistics')) {
      return !(link.id === 'feedback' || link.id === 'statistics');
    }

    // 其他情況（預設），不鎖任何 tab（如果你要根據狀態鎖，可以放 checkStats 在這邊）
    return false;
  }


  checkStats(path: string): boolean {
    const currentState = this.questService.questState;
    const basePath = path.split('/:')[0];

    if (currentState === 'P' || currentState === 'N') {
      return ['tabnavigation/feedback/:id', '/tabnavigation/statistics'].includes(basePath);
    }
    else if (currentState === 'E' || currentState === 'S') {
      return ['tabnavigation/createquest', '/tabnavigation/createquestoption'].includes(basePath);
    }
    else if (currentState === 'createquest') {
      return ['tabnavigation/feedback/:id', '/tabnavigation/statistics', '/tabnavigation/createquestoption'].includes(basePath);
    }
    return false;
  }

  onTabClick(link: any, event: MouseEvent): void {
    if (this.isTabDisabled(link)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // 處理需要ID的路由
    if (link.requiresId && this.currentQuizId) {
      this.router.navigate([link.path, this.currentQuizId]);
    } else {
      this.router.navigate([link.path]);
    }
  }
}
