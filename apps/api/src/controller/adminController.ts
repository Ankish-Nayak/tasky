import { NextFunction, Request, Response } from "express";
import { User } from "models";
import { signupTypes } from "types";
export const getAdmins = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({ role: "admin" });
    const newUsers = users.map((user) => {
      const newUser = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
      };
      return newUser;
    });
    res.json({ newUsers });
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
      const newUser = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
      };
      res.json({ newUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
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
