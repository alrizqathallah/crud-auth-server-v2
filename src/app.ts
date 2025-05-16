import express, { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, _res: Response) => {
  _res.status(200).json({
    success: true,
    status: "OK",
    message: "Server is healthy",
    details: null,
  });
});

export { app };
