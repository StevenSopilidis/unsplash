import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

beforeAll(async () => {``
    process.env.JWT_KEY = "randomJWTKEYfortesting23342";
    process.env.NODE_ENV = "development";

    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections)
    {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})