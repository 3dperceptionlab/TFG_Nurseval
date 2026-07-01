export interface Step {
  id: string
  title: string;
  description: string;
  tip: string;
  image?: string;
}

export interface Protocol {
  id: string;
  title: string;
  purpose: string;
  materials: string[];
  image?: string;
  steps: Step[];
  video: string;
}
