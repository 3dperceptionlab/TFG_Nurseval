export interface LoginResponse {
  accessToken: string;
  tokenType: string; 
}

export interface User {
  id: string;
  name: string;
  email: string;
  surname: string;
  role: string; 
}
