import { BaseError, ErrorObject } from "./BaseError";

export class BadRequestError extends BaseError
{
    statusCode = 400;
    constructor(public message: string)
    {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors(): ErrorObject[] {
        return [{message: this.message}];
    }

}