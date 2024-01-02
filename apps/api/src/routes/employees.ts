import express, { NextFunction, Request, Response } from "express";
import { User } from "models";
import * as commonController from "../controller/commonControllers";
import * as employeeController from "../controller/employeeController";
import { authenticateJWT } from "../middlewares/auth";
export const router = express.Router();

router.get("/me", authenticateJWT, commonController.me);

router.put("/login", commonController.login);

router.post("/signup", employeeController.signup);

router.put("/logout", authenticateJWT, commonController.logout);

router.get("/", authenticateJWT, employeeController.getEmployees);

router.get("/:userId", authenticateJWT, employeeController.getEmployee);
