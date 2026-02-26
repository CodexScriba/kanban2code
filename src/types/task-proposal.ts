import { Stage } from './task';

export interface TaskProposal {
  title: string;
  description: string;
  stage: Stage;
  agent?: string;
  tags?: string[];
  project?: string;
  phase?: string;
  contexts?: string[];
  skills?: string[];
}
