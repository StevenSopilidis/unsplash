import { app } from "./app";
import dotenv from "dotenv";
import { connect } from "mongoose";
import { v2 as cloudinary} from "cloudinary";
import Stripe from "stripe";


dotenv.config({ path: "src/config.env"});

const secret = process.env.STRIPE_SECRET_KEY!;

export const stripe = new Stripe(secret, {
    typescript: true,    
    apiVersion: "2020-08-27"
});

const port: number = process.env.PORT? parseInt(process.env.PORT) : 5000;

const start = async () => {
    if(process.env.CONNECTION_STRING)
    {   
        let connectionString = process.env.CONNECTION_STRING;
        if(process.env.DATABASE_PASSWORD)
        {
            connectionString = connectionString.replace("PASSWORD", process.env.DATABASE_PASSWORD);
        }else{
            throw new Error("Database password was not provided");
        }
        
        try {
            await connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })

            console.log("connected to database");
        } catch (error) {
            console.log(error)
        }

        //configure cloudianary
        if(!process.env.CLOUDINARY_CLOUD_NAME)
            throw new Error("Please define CLOUDINARY_CLOUD_NAME in environment variable");
        
        if(!process.env.CLOUDINARY_API_KEY)
            throw new Error("Please define CLOUDINARY_API_KEY in environment variable");
        
        if(!process.env.CLOUDINARY_API_SECRET)
            throw new Error("Please define CLOYDINARY_API_SECRET in environment variable");

        if(!process.env.STRIPE_SECRET_KEY)
            throw new Error("Please define STRIPE_SECRET_KEY in environment variable");

        if(!process.env.STRIPE_WEBHOOK_SECRET)
            throw new Error("Please define STRIPE_WEBHOOK_SECRET in environment variables");

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: process.env.NODE_ENV === "production"
        });

        app.listen(port, () => {
            console.log(`listening to port ${port}`);
        });
    }else{
        throw new Error("Database paassword was not defined");
    };
}

start();