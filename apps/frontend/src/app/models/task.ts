export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'progress' | 'done' | 'approved';
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  assignedBy: string;
}
