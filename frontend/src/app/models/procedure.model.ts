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