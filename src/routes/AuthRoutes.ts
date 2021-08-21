import { app } from "../app";
import { Router, Request, Response } from "express";
import { validateRequest } from "../middleware/ValidateRequest";
import { body } from "express-validator";
import { User } from "../models/User";
import { BadRequestError } from "../errors/BadRequestError";
import { CreateJwt } from "../Utils/Jwt";

const router = Router();

//route for signing up
router.post("/api/auth/signup", 
[
    body("Username")
        .trim()
        .isLength({ min : 3, max: 15})
        .withMessage("Username must be between 3 and 15 characters"),

    body("Password")
        .trim()
        .isLength({ min: 8, max: 30})
        .withMessage("Password must be between 8 and 40 characteres"),

    body("Email")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("Country")
        .notEmpty()
        .withMessage("Please provide the country in which you live in"),

    body("City")
        .notEmpty()
        .withMessage("Please provide the city in which you live in")
],
validateRequest,
async (req: Request, res: Response) => {
    const { Username, Email, Password, Country, City } = req.body;
    const user = await User.findOne( 
        { $or: [ { Email: Email }, { Username: Username } ] } 
    );
    if(user)
        throw new BadRequestError("Email or Usernamne is already used by another user");
    const newUser = User.build({Username,Email, Password, Country, City});
    await newUser.save();
    res.status(201).send(newUser);
})

router.post("/api/auth/signin", 
[
    body("Email")
        .isEmail()
        .withMessage("Provide a valid Email"),
    
    body("Password")
        .notEmpty()
        .withMessage("Provided a password for signing in")
],
validateRequest,
async (req: Request, res: Response) => {
    const { Email, Password } = req.body;
    const user = await User.findOne({Email: Email});

    if(!user || !await User.validateUsersPassoword(Password, user.Password))
        throw new BadRequestError("Invalid Email or Password");
    const jwt = CreateJwt({
        username: user.Username,
        id: user._id
    });
    req.session = {
        jwt
    };
    res.status(200).send(user);
})

export { router as AuthRoutes };