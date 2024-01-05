import express, { NextFunction, Request, Response } from "express";
import * as commonController from "../controller/commonControllers";
import * as employeeController from "../controller/employeeController";
import { authenticateJWT } from "../middlewares/auth";
export const router = express.Router();

router.get("/me", authenticateJWT, commonController.me);

router.put("/login", commonController.login);

router.post("/signup", employeeController.signup);

router.put("/logout", authenticateJWT, commonController.logout);

router.get(
  "/",
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.query.username as string;
    if (typeof username === "string") {
      return employeeController.getEmployeesUsername(req, res, next);
    } else {
      return employeeController.getEmployees(req, res, next);
    }
  },
);

router.get(
  "/username/:regex",
  authenticateJWT,
  employeeController.getEmployeesByRegex,
);

router.get("/:userId", authenticateJWT, employeeController.getEmployee);
