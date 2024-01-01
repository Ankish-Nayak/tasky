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
  if (typeof token === "string") {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        console.log("jwt error");
        res.status(401).json({ message: "jwt error" });
      }
      if (typeof payload === "undefined" || typeof payload === "string") {
        res.status(498).json({ message: "invalid token" });
        return;
      }
      req.headers["role"] = payload.role;
      req.headers["userId"] = payload.userId;
      next();
    });
  }
  res.status(401).json({ message: "failed authentication" });
};
