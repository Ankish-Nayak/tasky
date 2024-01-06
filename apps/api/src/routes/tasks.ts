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
    const filterBy = req.query.filterBy as string;
    const sortBy = req.query.sortBy as string;
    console.log(filterBy);
    let status: string | null = null;
    let sort: string | null = null;
    if (["pending", "done", "approved", "progress"].includes(filterBy)) {
      console.log("dondone");
      status = filterBy;
    }
    if (["recent", "oldest"].includes(sortBy)) {
      sort = sortBy;
    }
    if (typeof assignedBy === "string") {
      return taskController.getTasksByAssignedByAdminId(req, res, next);
    } else if (typeof assingedTo === "string") {
      return taskController.getTasksByAssignedToByEmployeeId(req, res, next);
    } else if (status !== null) {
      return taskController.getTasksByJwtRoleFilterBy(req, res, next);
    } else {
      return taskController.getTasksByJwtRole(req, res, next);
    }
  },
);

router.post(
  "/title-taken",
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.query.taskId;
    if (typeof taskId === "string") {
      return taskController.isTitleTakenUpdate(req, res, next);
    } else {
      return taskController.isTitleTaken(req, res, next);
    }
  },
);

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
router.get("/:taskId", authenticateJWT, taskController.getTaskById);
router.delete("/:taskId", authenticateJWT, taskController.deleteTask);

router.put("/:taskId", authenticateJWT, taskController.updateTaskById);
