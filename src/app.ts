import "express-async-errors";
import express, { Request, Response } from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { AuthRoutes } from "./routes/AuthRoutes";
import { NotFoundEror } from "./errors/NotFoundError";

const app = express();

app.use(json());
app.use(cookieSession({
    httpOnly: true,
    secure: process.env.NODE_ENVIRONMENT === "productin",
}));

app.use(AuthRoutes);
app.use("*", (req: Request, Res: Response) => {
    throw new NotFoundEror();
});
app.use(ErrorHandler);

export {app};