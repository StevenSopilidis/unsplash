import { sign } from "jsonwebtoken";

type createJwtAttrs = {
    username: string;
    id: string;
}

const JWT_DAYS_LAST = 7;

//function to create a jwt that will be issued to the user
export const CreateJwt = (attrs: createJwtAttrs) => {
    //jwt will expire in 7 days
    return sign(attrs, process.env.JWT_KEY!, { expiresIn: JWT_DAYS_LAST * 24 * 3600 * 24});
};

