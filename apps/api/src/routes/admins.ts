import express from "express";
import * as commonController from "../controller/commonControllers";
import * as emloyeeController from "../controller/employeeController";
import { authenticateJWT } from "../middlewares/auth";

export const router = express.Router();

router.get("/login", commonController.login);

router.post("/signup", commonController.signup);
// get all the employee
router.get("/", authenticateJWT, emloyeeController.getEmployees);

router.get("/:userId", authenticateJWT, emloyeeController.getEmployees);

router.put("/logout", authenticateJWT, commonController.logout);
