import { User } from "./auth.model";

export interface procedureSummary {
  id: string;
  protocolName: string;
  date: Date;
  state: string;
  student: User;
  globalMetrics: {
    duration: number;
    errorCount: number;
    attentionPercent: number;
    mark: number;
  };
}

export interface Position {
  x: number;
  y: number;
  z: number;
}
export interface Rotation {
  p: number; 
  y: number;
  r: number; 
}

export interface Frame {
  id?: string;
  time: number;
  rightHandPos: Position;
  rightHandRot: Rotation;
  leftHandPos: Position;
  leftHandRot: Rotation;
  headPos: Position;
  headRot: Rotation;
  eyeTrackerPos: Position;
  eyeTrackerDir: Position;
}

export interface HololensData {
  id: string;
  frames: Frame[];
}

export interface Step {
  id: string;
  title: string;
  description: string;
  tip: string;
  image?: string;
}

export interface ProtocolDetail {
  id: string;
  title: string;
  description?: string;
  steps: Step[];
}

export interface Annotation {
  id: string;
  minute: number; 
  title: string;
  description: string;
  type: 'error' | 'mejora' | 'correcto';
  tip: string;
}

export interface GlobalMetrics {
  duration: number;
  errorCount: number;
  attentionPercent: number;
  mark: number;
}

export interface ProcedureDetail {
  id: string;
  studentId: string;
  studentName: string;
  studentSurname: string;
  professor: string;
  protocol: ProtocolDetail;
  date: string; 
  state: string;
  video: string; 
  globalMetrics: GlobalMetrics;
  annotations: Annotation[];
  comment: string;
  hololens?: HololensData; 
}