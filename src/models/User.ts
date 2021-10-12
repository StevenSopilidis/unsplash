import mongoose from "mongoose";
import { hash, compare } from "bcryptjs"

//tiers for montly subscription
export enum SubscriptionTier
{
    DefaultTier="DefaultTier",
    LowTier="LowTier",
    MediumTier="MediumTier",
    HighTier="HighTier",
};

//price to purchase a subscription in dollars
export enum SubscriptionFee
{
    DefaultTierFee=0,
    LowTierFee=5,
    MediumTierFee=10,
    HighTierFee=15
};

//ammount of data (in gigabytes) a user can use
export enum SubscriptionStorageAmmount
{
    DefaultTierStorage=2,
    LowTierStorage= 7,
    MediumTierStorage=15,
    HighTierStorage=30 
}

export const getTierPrice = (tier: string) : number => {
    switch (tier) {
        case "LowTier":
            return SubscriptionFee.LowTierFee;
        case "MediumTier":
            return SubscriptionFee.MediumTierFee;
        case "HighTier":
            return SubscriptionFee.HighTierFee;
        default:
            return SubscriptionFee.DefaultTierFee;
    }
}

//func to determine the value of each tier
export const getTierValue = (tier: string) => {
    switch (tier) {
        case "LowTier":
            return 1;
        case "MediumTier":
            return 2;
        case "HighTier":
            return 3;
        default:
            return 0;
    }
} 

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
    validateUsersPassoword(providedPassword: string, hash: string): Promise<boolean>;
};

export interface IUserDoc extends mongoose.Document
{
    Username: string;
    Email: string;
    Password: string;
    Country: string;
    City: string;
    UserTier: SubscriptionTier;
    StorageLeft: SubscriptionStorageAmmount
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
        UserTier: {
            type: SubscriptionTier,
            default: SubscriptionTier.DefaultTier
        },
        //ammount of data left to the user to use
        StorageLeft: {
            type: Number,
            default: SubscriptionStorageAmmount.DefaultTierStorage
        }
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

userSchema.statics.validateUsersPassoword = async function(providedPassword: string, hash: string) 
: Promise<boolean>
{
    return await compare(providedPassword, hash);
}

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };







