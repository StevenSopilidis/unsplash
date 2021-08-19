import request from "supertest";
import { app } from "../../app";

it("return 400 when too short username or password were provided", async () => {
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
})