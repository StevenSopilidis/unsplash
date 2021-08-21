import { BaseError, ErrorObject } from "./BaseError";

export class UnauthorizedError extends BaseError
{
    statusCode = 401;
    constructor()
    {
        super("Not authorized");
        Object.setPrototypeOf(this, UnauthorizedError);
    }
    
    serializeErrors(): ErrorObject[] {
        return [{message: "Not authorized"}];
    }
}