export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'progress' | 'done' | 'approved';
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  assignedBy: {
    _id: string;
    firstname: string;
    lastname: string;
  };
}

export type IFilter =
  | 'pending'
  | 'done'
  | 'progress'
  | 'approved'
  | null
  | 'approve';
