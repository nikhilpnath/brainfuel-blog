import morgan from "morgan";
import cors, { CorsOptions } from "cors";

import "module-alias/register";
//It makes path aliases (@alias/...) work in JavaScript after compiling TypeScript.

import express, { Application } from "express";
import helmet from "helmet";
import { clerkMiddleware } from "@clerk/express";

import router from "./routes";
import logger from "./logger";
import { connectToDB } from "@config/connectDB";
import webhookRoute from "@routes/webhook.route";
import { errorHandler } from "@middleware/errorHandler.middleware";
import { generalLimiter } from "@middleware/rateLimiter.middleware";

const app: Application = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(clerkMiddleware());
// it assigns the user session to req.auth

app.use("/webhooks", webhookRoute);
// for webhooks we use body parser and for the rest we are using express.josn which creates conflcts
// thats why we put this route above

const options: CorsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const morganFormat = ":method :url :status :response-time ms";

app
  .disable("x-powered-by")
  .use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  )
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors(options))
  .use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

//db connection
connectToDB();

// rate limiting for api routes
app.use("/api", generalLimiter);

// routes
app.use(router);

app.use(errorHandler);

app.listen(PORT, () => console.log("Running on Port", PORT));
