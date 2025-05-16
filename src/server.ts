import dotenv from "dotenv";
import { app } from "./app";

dotenv.config({
  path: ".env.local",
});

const port = process.env.PORT || 8001;
const env = process.env.NODE_ENV || "developement";

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${env} mode`);
});

export { server, port, env };
