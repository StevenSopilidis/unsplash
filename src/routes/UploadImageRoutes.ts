import { Request, Response, Router } from "express";
import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundEror } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Require_Auth } from "../middleware/Require_Auth";
import { Photo } from "../models/Photo";
import { User } from "../models/User";
import { UploadImage, UserHasEnoughStorageLeft } from "../Utils/FileUploader";

const router = Router();

router.post("/api/images/upload", 
Require_Auth,
async (req: Request, res: Response) => {
    const uploaded = req.files?.image;
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
                const result = await UploadImage(image, current_user);
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
            
            const result = await UploadImage(uploaded, current_user);
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
    
    //!check if the user provided valid mongo id
    const photo = await Photo.findById(imageId);
    if(!photo)
        throw new NotFoundEror();
    
    res.status(200).send(photo);
});

export { router as UploadImageRoutes };