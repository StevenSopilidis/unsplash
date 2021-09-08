import mongoose from "mongoose";
import { IUserDoc } from "./User";

interface IPhotoAttrs
{
    PublicId: string,
    Url: string;
    User: IUserDoc;
}

interface IPhotoModel extends mongoose.Model<IPhotoDoc>
{
    build(atts: IPhotoAttrs): IPhotoDoc;
}

//returned user when quering for photo
interface IPhotoReturnedUser
{
    Username: string;
    Country: string;
    City: string;
}


interface IPhotoDoc extends mongoose.Document
{
    PublicId: string;
    Url: string;
    User: IPhotoReturnedUser;
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
    }
});

photoSchema.pre<IPhotoDoc>(/^find/, async function(next){
    this.populate({
        path: "User",
        select: "Username Country City"
    });
})

photoSchema.statics.build = (attrs: IPhotoAttrs) => {
    return new Photo(attrs);
}

const Photo = mongoose.model<IPhotoDoc, IPhotoModel>("Photo", photoSchema);

export { Photo };