import mongoose from "mongoose";
import { IUserDoc } from "./User";

interface IPhotoAttrs
{
    PublicId: string,
    Url: string;
    User: IUserDoc;
    Label: string;
    Size: number;
}

interface IPhotoModel extends mongoose.Model<IPhotoDoc>
{
    build(atts: IPhotoAttrs): IPhotoDoc;
}

//returned user when quering for photo
export interface IPhotoReturnedUser
{
    _id: string;
    Username: string;
    Email: string;
    Country: string;
    City: string;
}


export interface IPhotoDoc extends mongoose.Document
{
    PublicId: string;
    Url: string;
    User: IPhotoReturnedUser;
    Label: string;
    Uploaded: Date;
    Size: number;
};

const photoSchema = new mongoose.Schema({
    PublicId: {
        type: String,
        required: true
    },
    Url: {
        type: String,
        required: true
    },
    User: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true        
    },
    Label: {
        type: String,
        required: true
    },
    Uploaded: {
        type: Date,
        default: Date.now
    },
    Size: {
        type: Number,
    }
});

// photoSchema.pre<IPhotoDoc>(/^find/, async function(next){
//     this.populate({
//         path: "User",
//         select: "Username Email Country City"
//     });
// });

photoSchema.statics.build = (attrs: IPhotoAttrs) => {
    return new Photo(attrs);
};

const Photo = mongoose.model<IPhotoDoc, IPhotoModel>("Photo", photoSchema);

export { Photo };