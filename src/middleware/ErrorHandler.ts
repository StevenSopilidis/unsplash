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
        if (process.env.NODE_ENVIRONMENT="development")
        {
            return res.status(err.statusCode).send({ 
                error: err.serializeErrors(),
                stackTrace: err.stack
            });
        }
        return res.status(err.statusCode).send({
            error: err.serializeErrors()
        });
    };

    if (process.env.NODE_ENVIRONMENT="development")
    {
        return res.status(500).send({
            error: [{
                message: "Something went wrong"
            }],
            stack: err.stack
        });
    };
    
    return res.status(500).send({
        error: [{
            message: "Something went wrong"
        }],
    });
}