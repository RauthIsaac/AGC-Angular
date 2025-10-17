import { environment } from "../../environments/environment";

export const API_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  SITE_IDENTITY: `${API_URL}/api/SiteIdentity`,
  MESSAGE_GUEST: {
    POST: `${API_URL}/api/Message_Guest`,
    GET_ALL: `${API_URL}/api/Message_Guest`
  },
  AUTH: {
    LOGIN: `${API_URL}/api/Auth/Login`
  },
  NEWS: {
    GET_ALL: `${API_URL}/api/News/GetAll`,
    CREATE: `${API_URL}/api/News`,
    UPDATE: `${API_URL}/api/News`,
    DELETE: `${API_URL}/api/News`
  }
};
