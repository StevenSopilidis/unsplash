import mongoose from "mongoose";

interface IUserAttrs
{
    Username: string;
    Email: string;
    Password: string;
    County: string;
    City: string;
};

interface IUserModel extends mongoose.Model<IUserDoc>
{
    build(attrs: IUserAttrs) : IUserDoc;
};

interface IUserDoc extends mongoose.Document
{
    Username: string;
    Email: string;
    Password: string;
    County: string;
    City: string;
}

const userSchema = new mongoose.Schema(
    {
        Username: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        Password: {
            type: String,
            required: true
        },
        Country: {
            type: String,
            required: true
        },
        City: {
            type: String,
            required: true
        },
    },
    {
        toJSON: {
            transform(doc, ret)
            {
                delete doc.Passowrd;
            }
        }
    }
);

userSchema.statics.build = ( attrs : IUserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };







