import { Request, Response, Router } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundEror } from "../errors/NotFoundError";
import { Require_Auth } from "../middleware/Require_Auth";
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
            const result = await UploadImage(uploaded);
        }
        catch(err)
        {
            throw new BadRequestError(err.message);
        }
    }
    res.status(200).send("hallo");
})

export { router as UploadImageRoutes };