import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Readable } from "stream";
import { Result } from "express-validator";
import mongoose from "mongoose";
import { Photo } from "../models/Photo";
import { IUserDoc } from "../models/User";

export const UploadImage = async (
image : fileUpload.UploadedFile, 
current_user: IUserDoc): Promise<void> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(async (err, result) => {
            if(err)
                reject(err);
            else
            {
                if(!result)
                {
                    reject(new Error("Did not get result from uploading image"));
                    return;
                }
                //add the photo instance to the database
                const photo = Photo.build({
                    PublicId: result.public_id,
                    Url: result.secure_url,
                    User: current_user
                });
                await photo.save();
                resolve();
            }
        });
        //convert the Buffer into a readable stream
        const readable = new Readable();
        readable.push(image.data);
        readable.push(null);
        readable.pipe(stream);
    })
};