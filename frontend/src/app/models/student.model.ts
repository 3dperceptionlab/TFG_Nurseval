export interface Student{
  id: string;
  name: string;
  surname: string;
  email: string;
  course: number;
  group: number,
  professorName: string
  image: string;
  lastLogin: Date;
  nPractices: number;
  avgMark: number;
}

export interface FilterParams {
  query: string;
  course: string;
  group: string;
}