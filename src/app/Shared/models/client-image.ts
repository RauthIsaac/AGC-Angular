export interface ClientImage {
  id: number;
  image_Url: string;
}

export interface ClientImageFormData {
  id: number;
  image_Url: string;
}

export interface CreateClientImageRequest {
  image_Url?: string;
}

export interface UpdateClientImageRequest {
  id: number;
  image_Url?: string;
}