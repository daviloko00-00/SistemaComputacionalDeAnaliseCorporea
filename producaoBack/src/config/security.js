import cors from "cors";
import helmet from "helmet";

export const securityMiddlewares = (app) => {
  app.use(helmet());

  app.use(
    cors({
      origin: "/",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
};