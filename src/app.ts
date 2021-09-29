import "express-async-errors";
import express, { Request, Response } from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { AuthRoutes } from "./routes/AuthRoutes";
import { NotFoundEror } from "./errors/NotFoundError";
import { ImageRoutes } from "./routes/ImageRoutes";
import upload from "express-fileupload";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(json());
app.use(upload());

app.use(cookieSession({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: false
}));

app.use(AuthRoutes);
app.use(ImageRoutes);

app.all("*", (req: Request, Res: Response) => {
    throw new NotFoundEror();
});

app.use(ErrorHandler);

export {app};