import mongoose from "mongoose";
import { hash, compare } from "bcryptjs"

export interface IUserAttrs
{
    Username: string;
    Email: string;
    Password: string;
    Country: string;
    City: string;
};

interface IUserModel extends mongoose.Model<IUserDoc>
{
    build(attrs: IUserAttrs) : IUserDoc;
    validatePassowrd(providedPassword: string, hash: string): Promise<boolean>;
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
                delete ret.Passowrd;
            }
        }
    }
);

//if password is modified or new user is created
//save the password as a hash in the database
userSchema.pre<IUserDoc>("save", async function(next){
    if(!this.isModified("Password")) next();

    this.Password = await hash(this.Password, 12);
    next();
})

userSchema.statics.build = ( attrs : IUserAttrs) => {
    return new User(attrs);
}

userSchema.statics.validateUserPassoword = async function(providedPassword: string, hash: string) 
: Promise<boolean>
{
    return await compare(providedPassword, hash);
}

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };







