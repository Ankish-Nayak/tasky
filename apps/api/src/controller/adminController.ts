import { NextFunction, Request, Response } from "express";
import { User } from "models";
export const getAdmins = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({ role: "admin" });
    const newUsers = users.map((user) => {
      const { password: _, ...newUser } = user;
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
      const { password: _, ...newUser } = user;
      res.json({ newUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    next(e);
  }
};
