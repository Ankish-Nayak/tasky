import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "models";
import { loginTypes, signupTypes } from "types";
import { secret } from "..";
import { refreshLoginSession } from "../helpers/removeExpiryToken";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedInputs = loginTypes.parse(req.body);
    const { username, password } = parsedInputs;
    const existingUser = await User.findOne({
      username,
      password,
    });
    if (existingUser) {
      const token = jwt.sign(
        {
          userId: existingUser._id,
          role: existingUser.role,
        },
        secret,
        { expiresIn: "4h" },
      );
      const cookies = new Cookies(req, res);
      cookies.set("token", token);
      res.json({ message: "User loggedId" });
    } else {
      res.status(402).json({ message: "User not found" });
    }
  } catch (e) {
    next(e);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId;
  const role = req.headers.role;
  console.log("userId", userId);
  console.log("role", role);
  try {
    const existingUser = await User.findById(userId);
    if (existingUser) {
      const cookies = new Cookies(req, res);
      const token = cookies.get("token") as string;
      existingUser.loginSessions = await refreshLoginSession(
        token,
        secret,
        existingUser.loginSessions,
      );
      await existingUser.save();
      cookies.set("token", null);
      res.json({ message: "user logged out" });
    } else {
      res.status(400).json({ message: "user not found" });
    }
  } catch (e) {
    next(e);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.userId as string;
  const role = req.headers.role as string;
  try {
    if (role === "employee" || role === "admin") {
      const user = await User.findOne({
        _id: userId,
      });
      if (user) {
        res.json({
          firstname: user.firstname,
        });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    } else {
      res.status(400).json({ message: "invalid token" });
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
    const { firstname, lastname, username, password, role } = parsedInputs;

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
        role,
      });
      res.json({ message: "user created", username: newUser.username });
    }
  } catch (e) {
    next(e);
  }
};
