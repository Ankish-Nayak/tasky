import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "..";
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookies = new Cookies(req, res);

  const token = cookies.get("token");
  console.log(token);
  if (typeof token === "string") {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        console.log("jwt error");
        return res.status(401).json({ message: "jwt error" });
      }
      if (typeof payload === "undefined" || typeof payload === "string") {
        return res.status(498).json({ message: "invalid token" });
      }
      req.headers["role"] = payload.role;
      req.headers["userId"] = payload.userId;
      console.log("role", req.headers["role"]);
      console.log("userId", req.headers["userId"]);
      next();
    });
  } else {
    res.status(401).json({ message: "failed authentication" });
  }
};
