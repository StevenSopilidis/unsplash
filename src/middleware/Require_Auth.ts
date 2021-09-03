import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { JwtAttrs } from "../Utils/Jwt";
import { verify } from "jsonwebtoken";

declare global
{
    namespace Express
    {
        interface Request
        {
            currentUser?: JwtAttrs;
        }
    }
}

export const Require_Auth = ( req: Request,res: Response, next: NextFunction ) => 
{
    if(!req.session?.jwt)
        throw new UnauthorizedError();

    try {
        const payload = verify(req.session.jwt, process.env.JWT_KEY!) as JwtAttrs;
        req.currentUser = payload;
        next();
    } catch (error) {
        throw new UnauthorizedError();
    }
}