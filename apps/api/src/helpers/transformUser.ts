import { IUser } from "models";
import { Types, Document } from "mongoose";

export const transformUser = (
  user: Document<unknown, {}, IUser> &
    IUser & {
      _id: Types.ObjectId;
    },
) => {
  return {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
  };
};
export const transformUsers = (
  users: (Document<unknown, {}, IUser> &
    IUser & {
      _id: Types.ObjectId;
    })[],
) => {
  return users.map((user) => {
    const newUser = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
    };
    return newUser;
  });
};
