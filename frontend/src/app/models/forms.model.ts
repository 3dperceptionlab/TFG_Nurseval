export interface RegisterData {
  email: string;
  password: string;
  repassword: string;
  name:string;
  surname: string;
  role: string;
  position:string;
  student_group: number;
  student_course: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface EditProfileData {
  name: string;
  surname: string;
  currentpassword: string;
  newpassword: string;     
  repassword: string;
}

export interface EvaluationData { 
  mark: number; 
  comment: string 
}
