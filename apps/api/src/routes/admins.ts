import express from "express";
import * as commonController from "../controller/commonControllers";
import { authenticateJWT } from "../middlewares/auth";
import * as adminController from "../controller/adminController";

export const router = express.Router();

router.get("/me", authenticateJWT, commonController.me);

router.put("/login", commonController.login);

router.post("/signup", adminController.signup);
// get all the employee
router.get("/", authenticateJWT, adminController.getAdmins);

router.get("/:userId", authenticateJWT, adminController.getAdmin);

router.put("/logout", authenticateJWT, commonController.logout);

router.get(
  "/username/:regex",
  authenticateJWT,
  adminController.getAdminsByRegex,
);
