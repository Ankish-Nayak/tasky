import { Schema, model } from "mongoose";
export interface IUser {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  loginSessions: string[];
  role: "employee" | "admin";
}

const user = new Schema<IUser>({
  firstname: { type: Schema.Types.String, required: true },
  lastname: { type: Schema.Types.String, required: true },
  username: { type: Schema.Types.String, required: true, unique: true },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  role: {
    type: Schema.Types.String,
    enum: ["employee", "admin"],
    required: true,
    default: "employee",
  },
  loginSessions: [
    {
      type: Schema.Types.String,
    },
  ],
});

export const User = model<IUser>("User", user);
