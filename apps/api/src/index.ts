import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { run as connectToDb } from "models";
import errorHandler from "./middlewares/errorHandler";
import { router as adminRouter } from "./routes/admins";
import { router as employeeRouter } from "./routes/employees";
import { router as taskRouter } from "./routes/tasks";
import { router as userRouter } from "./routes/users";

config();
const app = express();
if (process.env.SECRET === undefined) {
  console.log("jwt sercret not found");
  process.exit(1);
}

export const secret: string = process.env.SECRET;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4200",
    ],
    credentials: true,
  }),
);

app.use(express.urlencoded());
app.use(express.json());

app.use("/employees", employeeRouter);
app.use("/admins", adminRouter);
app.use("/tasks", taskRouter);
app.use("/users", userRouter);

app.use((req, res) => {
  console.log("not hit", req.originalUrl);
  res.status(404).send("404 -Not Found");
});
app.use(errorHandler);

connectToDb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("live at ", `http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((e) => console.log(e));
