import { ValidationError } from "express-validator";
import { BaseError, ErrorObject } from "./BaseError";

export class RequestValidationError extends BaseError
{
    statusCode = 400;
    
    constructor(public errors: ValidationError[])
    {
        super("Invalid request paramenters");

        Object.setPrototypeOf   (this, RequestValidationError.prototype);
    };

    serializeErrors(): ErrorObject[] {
        return this.errors.map(err => {
            return {
                message: err.msg,
                field: err.param
            }
        })
    }

}