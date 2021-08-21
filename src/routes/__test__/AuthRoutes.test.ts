import request from "supertest";
import { app } from "../../app";
import { IUserAttrs } from "../../models/User";

const signUp = (data : IUserAttrs) => {

}

it("return 400 when too short username or password were provided on signup", async () => {
    await request(app)
        .post("/api/auth/signup")
        .send({
            Username: "o",
            Password: "Stefanos124325234",
            Email: "test@test.com",
            Country: "Greece",
            City: "Athens"
        })
        .expect(400);

    await request(app)
        .post("/api/auth/signup")
        .send({
            Username: "Steven",
            Password: "Stes",
            Email: "test@test.com",
            Country: "Greece",
            City: "Athens"
        })
        .expect(400);
});

it("returns 400 when invalid email was provided on signup", async () => {
    await request(app)
        .post("/api/auth/signup")
        .send({
            Username: "Test123",
            Password: "Stefanos124325234",
            Email: "invalidemail",
            Country: "Greece",
            City: "Athens"
        })
        .expect(400);
});

it("return 400 when user tries to use a username or email that is already in use", async() => {
    await request(app)
        .post("/api/auth/signup")
        .send({
            Username: "Stef123",
            Email: "stef@gmail.com",
            Password: "Stefanos12345",
            Country: "Greece",
            City: "Athens"
        })
        .expect(201);
    
    //for the duplicate email
    await request(app)
        .post("/api/auth/signup")
        .send({
            Username: "anestis123",
            Email: "stef@gmail.com",
            Password: "Stefanos12345",
            Country: "Greece",
            City: "Athens"
        })
        .expect(400);
    
    await request(app)
        .post("/api/auth/signup")
        .send({
            Username: "Stef123",
            Email: "aeqwrew@gmail.com",
            Password: "Stefanos12345",
            Country: "Greece",
            City: "Athens"
        })
        .expect(400);
})

it("returns 201 when the data provided was valid", async () => {

})