export interface RegisterData {
  email: string;
  password: string;
  repassword: string;
  name:string;
  surname: string;
  role: string;
  position:string;
  student_group: number;
  student_course: string;
}

export interface LoginData {
  email: string;
  password: string;
}