import { Request, Response, NextFunction } from "express";
import { Task } from "models";
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = req.query.status;
  const userId = req.headers.userId as string;
  try {
    if (status === "pending" || "progress" || "done" || "aproved") {
      const tasks = await Task.find({ assignedTo: userId, status });
      res.json({ tasks });
    } else {
      const tasks = await Task.find({ assignedTo: userId });
      res.json({ tasks });
    }
  } catch (e) {
    next(e);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId as string;
  const role = req.headers.role as string;
  const taskId = req.params.userId;
  if (role === "employee") {
    return res
      .status(400)
      .json({ message: "admin only allowed to delete task" });
  }
  try {
    const task = await Task.findOne({ _id: taskId });
    if (task) {
      if (task.assignedBy.toString() === userId) {
        await Task.findByIdAndDelete(task._id);
        res.json({ message: "deleted" });
      } else {
        res
          .status(400)
          .json({ message: "this admin not allowed to delete task" });
      }
    } else {
      res.status(404).json({ message: "task dose not exists" });
    }
  } catch (e) {
    next(e);
  }
};

export const approveTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId;
  const taskId = req.params.taskId as string;
  const role = req.headers.role as string;
  if (role !== "admin") {
    return res
      .status(400)
      .json({ message: "admin is only allowed to approve task" });
  }
  try {
    const existingTask = await Task.findById(userId);
    if (existingTask) {
      const updatedTask = await Task.findByIdAndUpdate(taskId, {
        status: "approved",
      });
      if (updatedTask) {
        res.json({ id: updatedTask._id });
      } else {
        res.status(403).json({ message: "failed to update" });
      }
    } else {
      res.status(404).json({ message: "task dose not exists" });
    }
  } catch (e) {
    next(e);
  }
};

export const startTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const taskId = req.params.taskId as string;
  const role = req.headers.role as string;
  if (role !== "employee") {
    return res.status(400).json({ message: "employee can only start task" });
  }
  try {
    const task = await Task.findById(taskId);
    if (task) {
      if (task.status === "pending") {
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
          status: "progress",
        });
        if (updatedTask) {
          res.json({ message: "task updated", id: updatedTask._id });
        } else {
          res.status(403).json({ message: "failed to update task" });
        }
      } else {
        res.status(400).json({ message: "task is not in pending state" });
      }
    } else {
      res.status(404).json({ message: "task dose not exists" });
    }
  } catch (e) {
    next(e);
  }
};

export const doneTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const taskId = req.params.taskId as string;
  const role = req.headers.role as string;
  if (role !== "admin") {
    return res
      .status(400)
      .json({ message: "employee can only mark as done task" });
  }
  try {
    const task = await Task.findById(taskId);
    if (task) {
      if (task.status === "progress") {
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
          status: "done",
        });
        if (updatedTask) {
          res.json({ message: "task marked as done" });
        } else {
          res.status(400).json({ message: "failed to update task" });
        }
      } else {
        res.status(400).json({ message: "task is not in progress" });
      }
    } else {
      res.status(404).json({ message: "task dose not exists" });
    }
  } catch (e) {
    next(e);
  }
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks = await Task.find({});
    res.json({ tasks });
  } catch (e) {
    next(e);
  }
};

export const getTasksByAsssigedByLoggedInEmployeeId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId;
  const role = req.headers.role;
  if (role !== "employee") {
    res.status(400).json({ message: "employee only allowed" });
  }
  try {
    const tasks = await Task.find({
      assignedTo: userId,
    });
    res.json({ tasks });
  } catch (e) {
    next(e);
  }
};

export const getTasksByAssignedToByEmployeeId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const employeeId = req.headers.userId;
  const role = req.headers.role;
  if (role !== "employee") {
    res.status(400).json({ message: "employee only allowed" });
  }
  try {
    const tasks = await Task.find({
      assignedTo: employeeId,
    });
    res.json({ tasks });
  } catch (e) {
    next(e);
  }
};

export const getTasksByAssignedByAdminId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const adminId = req.headers.userId;
  const role = req.headers.role;
  if (role !== "admin") {
    res.status(400).json({ message: "admin only allowed" });
  }
  try {
    const tasks = await Task.find({
      assignedBy: adminId,
    });
    res.json({ tasks });
  } catch (e) {
    next(e);
  }
};
