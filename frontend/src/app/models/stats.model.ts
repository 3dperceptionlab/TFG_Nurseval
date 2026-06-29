export interface ProtocolStats {
  protocolName: string;
  total: number;
  passed: number;
  failed: number;
  avgMark: number;
}

export interface MonthStats {
  year: number;
  month: number;
  total: number;
  avgMark: number;
  totalByProtocol: Record<string, number>;
  avgMarkByProtocol: Record<string, number>;
}

export interface StudentStats {
  totalProcedures: number;
  evaluatedProcedures: number;
  pendingProcedures: number;
  avgMark: number;
  avgAttention: number;
  avgErrors: number;
  byProtocol: ProtocolStats[];
  byMonth: MonthStats[];
}

// -----------------------------------------------------------

export interface ProfessorProtocolStats {
  protocolName: string;
  total: number;
  passed: number;
  failed: number;
  avgMark: number;
  avgAttention: number;
  avgErrors: number;
}

export interface ProfessorMonthStats {
  year: number;
  month: number;
  total: number;
  evaluated: number;
  pending: number;
  avgMark: number;
  totalByProtocol: Record<string, number>;
  avgMarkByProtocol: Record<string, number>;
}

export interface StudentRanking {
  studentId: string;
  studentName: string;
  totalProcedures: number;
  evaluated: number;
  pending: number;
  avgMark: number;
  bestProtocol: string;
  worstProtocol: string;
}

export interface ProfessorStats {
  totalStudents: number;
  totalProcedures: number;
  evaluatedProcedures: number;
  pendingProcedures: number;
  avgMark: number;
  avgAttention: number;
  avgErrors: number;
  byProtocol: ProfessorProtocolStats[];
  byMonth: ProfessorMonthStats[];
  studentRanking: StudentRanking[];
}