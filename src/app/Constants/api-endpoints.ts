import { environment } from '../../environments/environment.prod';

export const API_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  SITE_IDENTITY: {
    GET: `${API_URL}/api/SiteIdentity`
  },
  MESSAGE_GUEST: {
    POST: `${API_URL}/api/Message_Guest`
  }
};
