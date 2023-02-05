import { App } from "../src/app";
import { boot } from "../src/main";
import request from "supertest";

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

describe("User e2e", () => {
  it("Register - success", async () => {
    const res = await request(application.app)
      .post("/user/register")
      .send({ email: "test@a.kz", password: "190908", name: "Zhannur" });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("test@a.kz");
    expect(res.body.id).toBeTruthy();
  });

  it("Register - error", async () => {
    const res = await request(application.app)
      .post("/user/register")
      .send({ email: "test@a.kz", password: "190908", name: "Zhannur" });

    expect(res.statusCode).toBe(422);
  });

  it("Login - success", async () => {
    const res = await request(application.app)
      .post("/user/login")
      .send({ email: "test@a.kz", password: "190908" });

    expect(res.statusCode).toBe(200);
    expect(res.body.jwt).not.toBeUndefined();
  });

  it("Login - error", async () => {
    const res = await request(application.app)
      .post("/user/login")
      .send({ email: "test@a.kz", password: "19090801" });

    expect(res.statusCode).toBe(401);
  });

  it("Info - success", async () => {
    const login = await request(application.app)
      .post("/user/login")
      .send({ email: "test@a.kz", password: "190908" });

    const res = await request(application.app)
      .get("/user/info")
      .set("Authorization", `Bearer ${login.body.jwt}`);

    expect(res.body.email).toBe("test@a.kz");
  });

  it("Info - error", async () => {
    const res = await request(application.app)
      .get("/user/info")
      .set("Authorization", "Bearer 1");

    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
