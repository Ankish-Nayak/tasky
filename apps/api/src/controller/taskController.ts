import { NextFunction, Request, Response } from "express";
import { Task, User } from "models";
import { createTaskTypes } from "types";
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.body);
  const userId = req.headers.userId as string;
  const role = req.headers.role as string;
  if (role !== "admin") {
    return res
      .status(400)
      .json({ message: "Admin can only create task and assign it." });
  }
  try {
    const parsedInputs = createTaskTypes.parse(req.body);
    const { title, description, assignedTo } = parsedInputs;
    const existingUser = await User.findById(assignedTo);
    if (existingUser) {
      if (existingUser.role === "employee") {
        const existingTitle = await Task.findOne({
          title,
        });
        console.log("existingTask", existingTitle);
        if (existingTitle) {
          res.status(400).json({ message: "title is taken" });
        } else {
          const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: userId,
          });
          if (task) {
            res.json({ message: "task has been created", task });
          } else {
            res.status(409).json({ messae: "failed to create task" });
          }
        }
      } else {
        res
          .status(400)
          .json({ message: "task can be assigned to employee only" });
      }
    } else {
      res.status(400).json({ message: "employee not found" });
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
  const taskId = req.params.taskId as string;
  const role = req.headers.role as string;
  if (role !== "admin") {
    return res
      .status(400)
      .json({ message: "admin is only allowed to approve task" });
  }
  try {
    const existingTask = await Task.findById(taskId);
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

export const progressTask = async (
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
  if (role !== "employee") {
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
  _req: Request,
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

export const getTasksByJwtRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const role = req.headers.role as string;
  const userId = req.headers.userId as string;
  try {
    if (role === "admin") {
      const tasks = await Task.find({
        assignedBy: userId,
      })
        .populate({
          path: "assignedTo",
          select: "firstname lastname",
        })
        .populate({
          path: "assignedBy",
          select: "firstname lastname",
        });
      res.json({ tasks });
    } else if (role === "employee") {
      const tasks = await Task.find({
        assignedTo: userId,
      });
      res.json({ tasks });
    }
  } catch (e) {
    next(e);
  }
};

export const getTasksByAssignedToByEmployeeId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const assignedTo = req.query.assignedTo;
  const role = req.headers.role;
  if (role !== "employee") {
    res.status(400).json({ message: "employee only allowed" });
  }
  try {
    const tasks = await Task.find({
      assignedTo,
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
  const assignedBy = req.query.assignedBy;
  const role = req.headers.role;
  if (role !== "admin") {
    res.status(400).json({ message: "admin only allowed" });
  }
  try {
    const tasks = await Task.find({
      assignedBy,
    });
    res.json({ tasks });
  } catch (e) {
    next(e);
  }
};

export const isTitleTaken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title } = req.body;
  try {
    const task = await Task.findOne({ title });
    let titleTaken = false;
    if (task) {
      titleTaken = true;
    } else {
      titleTaken = false;
    }
    res.json({ titleTaken });
  } catch (e) {
    next(e);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);
    if (task) {
      res.json({ task });
    } else {
      res.status(404).json({ message: "task not found" });
    }
  } catch (e) {
    next(e);
  }
};
