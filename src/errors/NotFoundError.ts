import { BaseError, ErrorObject } from "./BaseError";

export class NotFoundEror extends BaseError
{
    statusCode = 404;
    constructor()
    {
        super("Resource trying to access does not exist");
        Object.setPrototypeOf(this, NotFoundEror.prototype);
    }
    serializeErrors(): ErrorObject[] {
        return [{ message: "Resource not found"}];
    }
    
}