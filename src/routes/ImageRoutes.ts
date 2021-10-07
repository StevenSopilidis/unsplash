import { Request, Response, Router } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundEror } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Require_Auth } from "../middleware/Require_Auth";
import { validateRequest } from "../middleware/ValidateRequest";
import { IPhotoDoc, IPhotoReturnedUser, Photo } from "../models/Photo";
import { User } from "../models/User";
import { DeletePhoto, UploadImage, UserHasEnoughStorageLeft } from "../Utils/FileUploader";
import { body } from "express-validator";
import { PaginationParams } from "../Utils/PaginationParams";

const router = Router();

router.post("/api/images/upload", 
Require_Auth,
[
    body("label")
        .isLength({min: 5, max: 300})
        .withMessage("Label must be between 5 and 300 characters")
],
validateRequest,
async (req: Request, res: Response) => {
    const uploaded = req.files?.image;
    const { label } = req.body;
    if(!uploaded)
        throw new BadRequestError("Please provide the image you want to upload");
    //get the current User
    const current_user = await User.findById(req.currentUser?.id);
    if(!current_user)
        throw new UnauthorizedError();

    if(Array.isArray(uploaded))
    {
        //total size of all the files the user tries to upload
        let total_size = 0;
        /**
         * check that all the files the user is trying to upload
         * are of type image
         * **/
        uploaded.forEach(file => {
            total_size += file.size;
            if(file.mimetype.split("/")[0] != "image")
                throw new BadRequestError("Please provide a file of type image");
        });

        //check if there is enough space left to upload image
        if(!UserHasEnoughStorageLeft(current_user, total_size))
            throw new BadRequestError("Not enough space in your profile to upload image.If you wish to upload this image level up your tier");

        //try to upload each image to cloudinary
        uploaded.forEach(async image => {
            try
            {
                const result = await UploadImage(image,label, current_user);
            }
            catch(err)
            {
                throw new BadRequestError(err.message);
            }
        });
    }else {
        //upload the single image 
       const file_type = uploaded.mimetype.split("/")[0];
       if(file_type != "image")
           throw new BadRequestError("Please provide a file of type image");
        try
        {
            //check if the user has enough space left to upload image
            if(!UserHasEnoughStorageLeft(current_user, uploaded.size))
                throw new BadRequestError("Not enough space in your profile to upload image.If you wish to upload this image level up your tier");
            
            const result = await UploadImage(uploaded,label, current_user);
        }
        catch(err)
        {
            throw new BadRequestError(err.message);
        }
    }
    res.status(201).send({
        message: "Image was uploaded successfully"
    });
})

router.get("/api/images/:imageId", async (req: Request, res: Response) => {
    const { imageId } = req.params;
    
    const photo = await Photo
        .findById(imageId)
        .populate({
            path: "User",
            select: "Username Email Country City"
        });
    if(!photo)
        throw new NotFoundEror();
    
    res.status(200).send(photo);
});

router.get("/api/images", async (req: Request, res: Response) => {
    const { currentPage, pageSize } = req.query;
    
    const paginationParams = new PaginationParams(currentPage?.toString(), pageSize?.toString());

    const images = await Photo
        .find()
        .populate({
            path: "User",
            select: "Username Email Country City"
        })
        .limit(paginationParams.pageSize)
        .skip((paginationParams.currentPage - 1) * paginationParams.pageSize)
        .sort("-Uploaded");

    res.status(200).send(images);
});

//route to get images of a certain user
router.get("/api/images/user/:username", async ( req: Request, res: Response) => {
    const { username } = req.params;

    //check if the user with userId exists
    const user = await User.findOne({ Username: username });
    if(!user)
        throw new BadRequestError(`User with username: ${username} does not exist`);

    const photos = await Photo
        .find({User: {
            _id: user._id,
            Username: user.Username,
            Email: user.Email,
            Country: user.Country,
            City: user.City,
        }})
        .populate({
            path: "User",
            select: "Username Email Country City"
        });
    
    res.status(200).send(photos);
})

router.delete("/api/images/:photoId", 
Require_Auth,
async (req: Request, res: Response) => {
    const { photoId } = req.params;
    const photo = await Photo
        .findById(photoId)
        .populate({
            path: "User",
            select: "Username Email Country City"
        });

    if(!photo)
        throw new NotFoundEror();
    //check if the user actuall owns the photo he/she tries to delete
    const currentUser = await User.findById(req.currentUser?.id);
    
    if(!currentUser || currentUser._id != photo.User._id.toString())
        throw new UnauthorizedError();

    await DeletePhoto(photo, currentUser);
    res.status(204).send();
});

export { router as ImageRoutes };
