export interface LoginResponse {
  accessToken: string;
  tokenType: string; 
}

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; 
}