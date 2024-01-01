import express from "express";
import { authenticateJWT } from "../middlewares/auth";
import * as commonController from "../controller/commonControllers";
import * as adminController from "../controller/adminController";
import * as emloyeeController from "../controller/employeeController";

const router = express.Router();

router.get("/login", commonController.login);

router.post("/signup", commonController.signup);
// get all the employee
router.get("/", authenticateJWT, emloyeeController.getEmployees);

router.get("/:userId", authenticateJWT, emloyeeController.getEmployees);
