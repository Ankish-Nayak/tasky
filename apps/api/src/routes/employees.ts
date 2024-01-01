import express, { NextFunction, Request, Response } from "express";
import { User } from "models";
import * as commonController from "../controller/commonControllers";
import { authenticateJWT } from "../middlewares/auth";
export const router = express.Router();

router.get("/login", commonController.login);

router.post("/signup", commonController.signup);

router.put("/logout", commonController.logout);

router.get(
  "/",
  authenticateJWT,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find({ role: "employee" });
      const newUsers = users.map((user) => {
        const { password: _, ...newUser } = user;
        return newUser;
      });
      res.json({ newUsers });
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/:userId",
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
      const user = await User.findOne({
        role: "employee",
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
  },
);
