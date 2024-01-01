import express from "express";
import { authenticateJWT } from "../middlewares/auth";
import * as taskController from "../controller/taskController";
export const router = express.Router();

router.post("/", authenticateJWT, taskController.createTask);

router.delete("/:taskId", authenticateJWT, taskController.deleteTask);

router.put(
  "/:taskId/mark-as-approved",
  authenticateJWT,
  taskController.approveTask,
);

router.put(
  "/:taskId/mark-as-progress",
  authenticateJWT,
  taskController.progressTask,
);

router.put("/:taskId/mark-as-done", authenticateJWT, taskController.doneTask);
