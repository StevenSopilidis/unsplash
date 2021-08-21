import { app } from "./app";
import dotenv, { parse } from "dotenv";
import { connect } from "mongoose";


dotenv.config({ path: "src/config.env"});

const port: number = process.env.PORT? parseInt(process.env.PORT) : 3000;

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

        app.listen(port, () => {
            console.log(`listening to port ${port}`);
        });
    }else{
        throw new Error("Database paassword was not defined");
    };
}

start();