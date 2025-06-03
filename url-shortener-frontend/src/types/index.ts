export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UrlItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export interface UrlState {
  urls: UrlItem[];
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  darkMode: boolean;
}