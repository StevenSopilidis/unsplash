import { Request,Response,NextFunction } from "express";
import { BaseError } from "../errors/BaseError";

export const ErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(err instanceof BaseError)
    {
        return res.status(err.statusCode).send({ error: err.serializeErrors()});
    }

    console.log(err);
    res.status(500).send({
        error: [{
            message: "Something went wrong"
        }]
    });
}