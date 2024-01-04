export interface IEmployee {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
}

export interface EmployeeList {
  employees: IEmployee[];
}
