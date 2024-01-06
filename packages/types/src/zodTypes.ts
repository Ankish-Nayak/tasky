import { z } from "zod";
export const loginTypes = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});
export const signupTypes = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["employee", "admin"]),
});

export const createTaskTypes = z.object({
  title: z.string().min(4),
  description: z.string().min(4),
  assignedTo: z.string().min(1),
});

export const updateTaskTypes = z.object({
  title: z.string().min(4),
  description: z.string().min(4),
});

export const isTittleTakenTypes = z.object({
  title: z.string(),
});

export type loginParams = z.infer<typeof loginTypes>;
export type signupParams = z.infer<typeof signupTypes>;
export type isTittleTakenParams = z.infer<typeof isTittleTakenTypes>;
