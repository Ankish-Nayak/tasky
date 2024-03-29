import { NextFunction, Request, Response } from "express";
import { User } from "models";
import { signupTypes } from "types";
import { transformUsers } from "../helpers/transformUser";
export const getEmployees = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({ role: "employee" });
    res.json({ employees: transformUsers(users) });
  } catch (e) {
    next(e);
  }
};

export const getEmployeesUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const username = req.query.username as string;
  try {
    const employees = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("username firstname");
    res.json({ employees });
  } catch (e) {
    next(e);
  }
};

export const getEmployeesByRegex = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const regex = req.params.regex as string;
  try {
    const employees = await User.find({
      role: "employee",
      username: { $regex: regex, $options: "i" },
    });
    res.json({ employees: transformUsers(employees) });
  } catch (e) {
    next(e);
  }
};

export const getEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({
      role: "employee",
      _id: userId,
    });
    if (user) {
      const newUser = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
      };
      res.json({ employee: newUser });
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
        role: "employee",
      });
      res.json({ message: "user created", username: newUser.username });
    }
  } catch (e) {
    next(e);
  }
};
