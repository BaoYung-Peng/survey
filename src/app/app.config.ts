import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { zh_TW, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(),provideRouter(routes), // 你的路由設定
    provideHttpClient(withInterceptorsFromDi()), provideNzI18n(zh_TW), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient() // ✅ 加入 HttpClient，替代 HttpClientModule
  ]
};
