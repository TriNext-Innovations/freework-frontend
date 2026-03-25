import { environment } from '../environments/environment';

export const API_BASE_URL = environment.apiUrl;
export const API_PREFIX = '/api';
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildApiEndpointUrl(path: string): string {
  return buildApiUrl(`${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`);
}
