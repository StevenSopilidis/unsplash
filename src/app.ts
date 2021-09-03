import "express-async-errors";
import express, { Request, Response } from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { AuthRoutes } from "./routes/AuthRoutes";
import { NotFoundEror } from "./errors/NotFoundError";
import { UploadImageRoutes } from "./routes/UploadImageRoutes";
import upload from "express-fileupload";

const app = express();

app.use(json());
app.use(upload());

app.use(cookieSession({
    httpOnly: true,
    secure: process.env.NODE_ENVIRONMENT === "production",
    signed: false
}));

app.use(AuthRoutes);
app.use(UploadImageRoutes);

app.all("*", (req: Request, Res: Response) => {
    throw new NotFoundEror();
});

app.use(ErrorHandler);

export {app};