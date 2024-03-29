import express, { NextFunction, Request, Response } from "express";
import { authenticateJWT } from "../middlewares/auth";
import * as commonController from "../controller/commonControllers";
export const router = express.Router();

router.get(
  "/open",
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.json({ message: "open like" });
  },
);

router.put("/logout", authenticateJWT, commonController.logout);

router.get("/me", authenticateJWT, commonController.me);

router.put("/login", commonController.login);

router.post("/signup", commonController.signup);

router.get("/", authenticateJWT, commonController.getUsers);

router.get(
  "/username/:regex",
  authenticateJWT,
  commonController.getUsersByRegex,
);

router.get("/:userId", authenticateJWT, commonController.getUserById);
