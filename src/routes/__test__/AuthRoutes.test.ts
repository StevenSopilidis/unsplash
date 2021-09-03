import { response } from "express";
import request, { Response } from "supertest";
import { getParsedCommandLineOfConfigFile } from "typescript";
import { app } from "../../app";
import { IUserAttrs } from "../../models/User";

export const signUp = async (data : IUserAttrs, expectedStatusCode : number) : Promise<Response> => {
    return await request(app)
        .post("/api/auth/signup")
        .send(data)
        .expect(expectedStatusCode);
}

const signIn = async (Email: string, Password: string, expectedStatusCode: number) => {
    return await request(app)
        .post("/api/auth/signin")
        .send({Email, Password})
        .expect(expectedStatusCode);
}

/**
For the signUp route 
**/

it("return 400 when too short username or password were provided on signup", async () => {
    await signUp({
        Username: "o",
        Password: "Stefanos124325234",
        Email: "test@test.com",
        Country: "Greece",
        City: "Athens"
    }, 400);

    await signUp({
        Username: "Steven",
        Password: "Stes",
        Email: "test@test.com",
        Country: "Greece",
        City: "Athens"
    }, 400);
});

it("returns 400 when invalid email was provided on signup", async () => {
    await signUp({
        Username: "Test123",
        Password: "Stefanos124325234",
        Email: "invalidemail",
        Country: "Greece",
        City: "Athens"
    }, 400);
});

it("return 400 when user tries to use a username or email that is already in use", async() => {
    await signUp({
        Username: "Stef123",
        Email: "stef@gmail.com",
        Password: "Stefanos12345",
        Country: "Greece",
        City: "Athens"
    }, 201);
    
    //for the duplicate email
    await signUp({
        Username: "anestis123",
        Email: "stef@gmail.com",
        Password: "Stefanos12345",
        Country: "Greece",
        City: "Athens"
    }, 400);
    
    await signUp({
        Username: "Stef123",
        Email: "aeqwrew@gmail.com",
        Password: "Stefanos12345",
        Country: "Greece",
        City: "Athens"
    }, 400);
})

it("returns 201 when the data provided was valid", async () => {
    await signUp({
        Username: "Test123",
        Email: "test@gmail.com",
        Password: "Test123456",
        Country: "France",
        City: "Paris",
    }, 201)
})

/**
For the signIn route 
**/

it("returns 400 when invalid email or password were provided", async () => {
    const data : IUserAttrs = {
        Username: "Stefanos123",
        Email: "ste@gmail.com",
        Password: "test324235r",
        Country: "France",
        City: "Paris"
    }
    await signUp(data, 201);
    //for invalid email
    await signIn("adjewrj@gmail.com", data.Password, 400);
    //for invalid password
    await signIn(data.Email, "invalidPassword", 400);
});

it("returns 200 when user signsIn successfully", async () => {
    const data : IUserAttrs = {
        Username: "Stefanos123",
        Email: "ste@gmail.com",
        Password: "test324235r",
        Country: "France",
        City: "Paris"
    };
    await signUp(data, 201);
    const res = await signIn(data.Email, data.Password, 200);
    //check if the cookie for the jwt was set successfully
    expect(res.get("Set-Cookie")).toBeDefined();
});