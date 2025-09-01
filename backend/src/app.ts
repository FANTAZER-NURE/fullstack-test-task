import express from "express";
import { router as rootRouter } from "./routes";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/", rootRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
       
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  );

  return app;
}
