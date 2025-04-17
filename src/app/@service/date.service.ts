import { Injectable } from '@angular/core';
import {
  format,
  addDays,
  subDays,
  differenceInDays,
  isBefore,
  isAfter,
  parseISO
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  // 將帶入的日期轉換為需要的格式yyyy-MM-dd
  changeDateFormat(dateData: Date, dateTyep: string = '-') {
    let year;
    let month;
    let date;
    if (dateData) {
        year = dateData.getFullYear();
        month = dateData.getMonth() + 1;
        if (String(month).length == 1) {
            month = '0' + month;
        }
        date = dateData.getDate();
        if (String(date).length == 1) {
            date = '0' + date;
        }

        return year + dateTyep + month + dateTyep + date;
    } else {
        return '';
    }
}

//   /**
//    * 通用日期格式化
//    * @param date 日期对象或字符串
//    * @param format 格式，默认为 yyyy-MM-dd
//    */
formatDate(date: Date | string | null, format: string = 'yyyy-MM-dd'): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    return format
      .replace('yyyy', year.toString())
      .replace('MM', month)
      .replace('dd', day);
  } catch (e) {
    console.error('日期格式化错误:', e);
    return '';
  }
}

addDate(dateData: Date, addDate: number) {
    dateData.setDate(dateData.getDate() + addDate);
    return dateData;
}

rmDate(dateData: Date, rmDate: number) {
    dateData.setDate(dateData.getDate() - rmDate);
    return dateData;
}
}
