export enum Language {
  English = 0,
  Arabic = 1
}

export interface NewsItem {
  id: number;
  langCode: number;
  siteIdentityId: number;
  newsImgUrl: string;
  title: string;
  subTitle: string;
  description: string;
  createdAt: string;
  si?: any;
}

export interface NewsDto {
  id: number;
  langCode: number; // 0 for English, 1 for Arabic
  newsImgUrl: string;
  title: string;
  subTitle: string;
  description: string;
}

export interface CreateNewsRequest {
  langCode: number;
  newsImgUrl: string;
  title: string;
  subTitle: string;
  description: string;
}

export interface UpdateNewsRequest {
  id: number;
  langCode: number;
  newsImgUrl: string;
  title: string;
  subTitle: string;
  description: string;
}