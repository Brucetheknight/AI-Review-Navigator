export interface ReviewStage {
  id: number;
  title: string;
  owner: string;
  status: 'draft' | 'in-progress' | 'complete';
}

const mockStages: ReviewStage[] = [
  { id: 1, title: 'Overview', owner: 'Product', status: 'complete' },
  { id: 2, title: 'Project Management', owner: 'Program', status: 'in-progress' },
  { id: 3, title: 'Wide Angle', owner: 'Strategy', status: 'draft' },
];

export const fetchStages = async (): Promise<ReviewStage[]> => {
  return Promise.resolve(mockStages);
};
