export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
}

export interface IUsers {
  users: IUser[];
}
