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
});

export const createTaskTypes = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  assignedTo: z.string().min(1),
});

export type loginParams = z.infer<typeof loginTypes>;
export type signupParams = z.infer<typeof signupTypes>;
