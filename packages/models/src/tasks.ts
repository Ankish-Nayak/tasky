import { model, ObjectId, Schema } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  status: "pending" | "progress" | "done" | "approved";
  createdAt: Date;
  updatedAt: Date;
  assignedTo: ObjectId;
  assignedBy: ObjectId;
}

export const task = new Schema<ITask>({
  title: { type: Schema.Types.String, required: true },
  description: { type: Schema.Types.String, required: true },
  assignedBy: { type: Schema.Types.ObjectId, required: true },
  assignedTo: { type: Schema.Types.ObjectId, required: true },
  status: {
    type: Schema.Types.String,
    enum: ["pending", "progress", "done", "approved"],
    default: "pending",
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Schema.Types.Date,
  },
});

export const Task = model<ITask>("Task", task);
