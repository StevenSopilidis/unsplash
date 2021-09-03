import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Readable } from "stream";

export const UploadImage = async ( image : fileUpload.UploadedFile) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((err, result) => {
            if(err)
            reject(err);
            else
            resolve(result);
        });
        //convert the Buffer into a readable stream
        const readable = new Readable();
        readable.push(image.data);
        readable.push(null);
        readable.pipe(stream);
    })
};