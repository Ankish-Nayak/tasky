import express, { NextFunction, Request, Response } from "express";
import * as taskController from "../controller/taskController";
import { authenticateJWT } from "../middlewares/auth";
export const router = express.Router();

router.post("/", authenticateJWT, taskController.createTask);

// give based on role
// if employee then gives task assigned to him
// if admin then gives task assigned by him
router.get(
  "/",
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const assingedTo = req.query.assingedTo;
    const assignedBy = req.query.assignedBy;

    if (typeof assignedBy === "string") {
      return taskController.getTasksByAssignedByAdminId(req, res, next);
    } else if (typeof assingedTo === "string") {
      return taskController.getTasksByAssignedToByEmployeeId(req, res, next);
    } else {
      // const role = req.headers.role as string;
      // if (role === "admin") {
      //   console.log("hit");
      //   return taskController.getTasksByAssignedByAdminId(req, res, next);
      // } else if (role === "employee") {
      //   return taskController.getTasksByAssignedToByEmployeeId(req, res, next);
      // }
      return taskController.getTasksByJwtRole(req, res, next);
    }
  },
);

router.post("/title-taken", authenticateJWT, taskController.isTitleTaken);

router.put("/:taskId", authenticateJWT, taskController.updateTaskById);
router.get("/:taskId", authenticateJWT, taskController.getTaskById);

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
