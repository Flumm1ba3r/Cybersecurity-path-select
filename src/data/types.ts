export type DisciplineAccent = 'cyan' | 'violet' | 'coral' | 'rose' | 'sky';

export interface ExternalLink {
  title: string;
  url: string;
  /** Platform, channel or publisher, as named in the plan. */
  source: string;
}

export interface Challenge extends ExternalLink {
  platform: string;
  description: string;
  /** Access note quoted / paraphrased from the plan. */
  accessNote: string;
  /** Extra resources the plan attaches to the assignment (e.g. Ghidra download). */
  related?: ExternalLink[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  source: string;
  purpose: string;
  /** Only present when supplied by the plan or verified at the source. */
  duration?: string;
  /** Only set when reliably derived from a YouTube watch URL. */
  youtubeId?: string;
  kind: 'video' | 'channel' | 'recording';
  /** Additional instruction from the plan (e.g. "select an episode"). */
  instruction?: string;
}

export interface Walkthrough extends ExternalLink {
  type: 'Official walkthrough' | 'Written walkthrough' | 'Community write-up' | 'Exercise & walkthrough';
}

export interface DayTask {
  id: string;
  text: string;
}

export interface Day {
  id: string;
  number: number;
  title: string;
  tasks: DayTask[];
  deliverable: string;
}

export interface Week {
  id: string;
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  accent: DisciplineAccent;
  scenario: string;
  centralQuestion: string;
  challenge: Challenge;
  videos: Video[];
  walkthroughs: Walkthrough[];
  days: Day[];
  toolsAndConcepts: string[];
  safety?: string;
  weeklyReflectionQuestions: string[];
  careerReality: string;
}
