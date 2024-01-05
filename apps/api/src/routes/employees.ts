import express from "express";
import * as commonController from "../controller/commonControllers";
import * as employeeController from "../controller/employeeController";
import { authenticateJWT } from "../middlewares/auth";
export const router = express.Router();

router.get("/me", authenticateJWT, commonController.me);

router.put("/login", commonController.login);

router.post("/signup", employeeController.signup);

router.put("/logout", authenticateJWT, commonController.logout);

router.get("/", authenticateJWT, employeeController.getEmployees);

router.get(
  "/username/:regex",
  authenticateJWT,
  employeeController.getEmployeesByRegex,
);

router.get("/:userId", authenticateJWT, employeeController.getEmployee);
