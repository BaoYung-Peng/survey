// question-type.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionTypeService {
  getTypeName(type: string): string {
    const typeMap: Record<string, string> = {
      'single': '單選題',
      'multi': '多選題',
      'Text': '文字題'
    };
    return typeMap[type] || type;
  }
}
