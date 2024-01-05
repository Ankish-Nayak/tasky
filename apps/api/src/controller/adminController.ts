import { NextFunction, Request, Response } from "express";
import { User } from "models";
import { signupTypes } from "types";
import { transformUser, transformUsers } from "../helpers/transformUser";
export const getAdmins = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({ role: "admin" });
    res.json({ newUsers: transformUsers(users) });
  } catch (e) {
    next(e);
  }
};

export const getAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({
      role: "admin",
      _id: userId,
    });
    if (user) {
      res.json({ newUser: transformUser(user) });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    next(e);
  }
};

export const getAdminsByRegex = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const regex = req.params.regex as string;
  try {
    const admins = await User.find({
      role: "admin",
      username: { $regex: regex, $options: "i" },
    });
    res.json({ employees: transformUsers(admins) });
  } catch (e) {
    next(e);
  }
};
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedInputs = signupTypes.parse(req.body);
    const { firstname, lastname, username, password } = parsedInputs;

    const existingUser = await User.findOne({
      username,
    });
    if (existingUser) {
      res.status(422).json({ message: "User already exists" });
    } else {
      const newUser = await User.create({
        firstname,
        lastname,
        username,
        password,
        role: "admin",
      });
      res.json({ message: "user created", username: newUser.username });
    }
  } catch (e) {
    next(e);
  }
};
