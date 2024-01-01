import express from "express";
import { authenticateJWT } from "../middlewares/auth";
import * as taskController from "../controller/taskController";
const router = express.Router();

router.post("/", authenticateJWT, taskController.createTask);

router.delete("/:taskId", authenticateJWT, taskController.deleteTask);

router.put(
  "/:taskId/mark-as-approved",
  authenticateJWT,
  taskController.approveTask,
);

router.put("/:taskId/mark-as-start", authenticateJWT, taskController.startTask);

router.put("/:taskId/mark-as-done", authenticateJWT, taskController.doneTask);
