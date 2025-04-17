export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp?: string;  // 可選，根據你的後端實際返回結構調整
}
