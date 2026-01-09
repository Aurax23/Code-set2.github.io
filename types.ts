
export interface WebsiteProposal {
  businessName: string;
  targetAudience: string;
  suggestedStyle: string;
  pages: {
    title: string;
    description: string;
    sections: string[];
  }[];
  colorPalette: string[];
  copyConcepts: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'contracted' | 'completed';
  value: number;
  date: string;
}

export enum AppRoute {
  HOME = 'home',
  PLANNER = 'planner',
  PORTFOLIO = 'portfolio',
  DASHBOARD = 'dashboard'
}
