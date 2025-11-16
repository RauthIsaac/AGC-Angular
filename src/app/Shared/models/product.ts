export enum Language {
  AR = 0,
  EN = 1
}

export interface Product {
  id: number;
  langCode: Language;
  name: string;
  title: string;
  subTitle?: string;
  description: string;
  benefit_Title_1?: string;
  benefit_Description_1?: string;
  benefit_Title_2?: string;
  benefit_Description_2?: string;
  benefit_Title_3?: string;
  benefit_Description_3?: string;
  benefit_Title_4?: string;
  benefit_Description_4?: string;
  applicationsList?: string;
  why_Choose_Statement?: string;
  why_Choose_List?: string;
  imageUrl?: string;
}

export interface CreateProductRequest {
  id?: number; // Optional ID for creating products with specific ID and different languages
  langCode: Language;
  name: string;
  title: string;
  subTitle?: string;
  description: string;
  benefit_Title_1?: string;
  benefit_Description_1?: string;
  benefit_Title_2?: string;
  benefit_Description_2?: string;
  benefit_Title_3?: string;
  benefit_Description_3?: string;
  benefit_Title_4?: string;
  benefit_Description_4?: string;
  applicationsList?: string;
  why_Choose_Statement?: string;
  why_Choose_List?: string;
  imageFile?: File;
}

export interface UpdateProductRequest {
  id: number;
  langCode: Language;
  name: string;
  title: string;
  subTitle?: string;
  description: string;
  benefit_Title_1?: string;
  benefit_Description_1?: string;
  benefit_Title_2?: string;
  benefit_Description_2?: string;
  benefit_Title_3?: string;
  benefit_Description_3?: string;
  benefit_Title_4?: string;
  benefit_Description_4?: string;
  applicationsList?: string;
  why_Choose_Statement?: string;
  why_Choose_List?: string;
  imageUrl?: string;
  imageFile?: File;
}