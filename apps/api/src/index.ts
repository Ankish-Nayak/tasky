import express from "express";
import { config } from "dotenv";

config();
const app = express();
if (process.env.SECRET === undefined) {
  console.log("jwt sercret not found");
  process.exit(1);
}

export const secret: string = process.env.SECRET;

app.listen(process.env.PORT || 3000, () => {
  console.log(`live at ${process.env.PORT || 3000}`);
});
