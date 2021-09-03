import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { IUserAttrs } from "../../models/User";
import { CreateJwt, JwtAttrs } from "../../Utils/Jwt";
import { signUp } from "./AuthRoutes.test";
import fs from "fs";

const filesForTestFolder = `${__dirname}\\FilesForTesting\\`;

const genAuthCookie = () => {
    const payLoad = {
        username: "steven21",
        id: mongoose.Types.ObjectId().toHexString()
    };
    const jwt = CreateJwt(payLoad);
    const session = { jwt };
    const SessionJson = JSON.stringify(session);
    const base64 = Buffer.from(SessionJson).toString("base64");
    return [`express:sess=${base64}`];
};

it("returns 401 when user tries to upload an image when not authenticated", async () => {
    await request(app)
        .post("/api/images/upload")
        .expect(401);
});

it("returns 400 when no image || images where provided", async () => {
    await request(app)
        .post("/api/images/upload")
        .set("Cookie", genAuthCookie())
        .expect(400);

})

it("returns 400 when invalid file type was provided (single file was provided)", async () => {
    const file = filesForTestFolder + "test_file.txt";
    await request(app)
        .post("/api/images/upload")
        .set("Content-type", "multipart/form-data")
        .set("Cookie", genAuthCookie())
        .attach("image", file)
        .expect(400);
});

it("returns 400 when invalid file type was provided (multiple file provided)", async () => {
    const file = filesForTestFolder + "test_file.txt";
    const file2 = filesForTestFolder + "mountain2.jpg";
    await request(app)
        .post("/api/images/upload")
        .set("Content-type", "multipart/form-data")
        .set("Cookie", genAuthCookie())
        .attach("image", file)
        .attach("image", file2)
        .expect(400);
});