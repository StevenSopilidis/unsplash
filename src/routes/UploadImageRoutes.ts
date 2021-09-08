import { Request, Response, Router } from "express";
import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundEror } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Require_Auth } from "../middleware/Require_Auth";
import { Photo } from "../models/Photo";
import { User } from "../models/User";
import { UploadImage } from "../Utils/FileUploader";

const router = Router();

router.post("/api/images/upload", 
Require_Auth,
async (req: Request, res: Response) => {
    const uploaded = req.files?.image;
    if(!uploaded)
        throw new BadRequestError("Please provide the image you want to upload");

    if(Array.isArray(uploaded))
    {
        //try to upload all the images the user has provided
        uploaded.forEach(file => {
            if(file.mimetype.split("/")[0] != "image")
                throw new BadRequestError("Please provide a file of type image");
        });

    }else {
        //upload the single image 
       const file_type = uploaded.mimetype.split("/")[0];
       if(file_type != "image")
           throw new BadRequestError("Please provide a file of type image");
        try
        {
            //get the current User
            const current_user = await User.findById(req.currentUser?.id);
            if(!current_user)
                throw new UnauthorizedError();
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