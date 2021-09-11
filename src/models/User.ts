import mongoose from "mongoose";
import { hash, compare } from "bcryptjs"

//tiers for montly subscription
enum SubscriptionTier
{
    DefaulyTier="Default tier",
    Low="Low tier",
    Medium="Medium tier",
    High="High tier",
};

//monthly fee of subscriptions in dollars
enum SubscriptionMonthFee
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
    County: string;
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
            default: SubscriptionTier.DefaulyTier
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







