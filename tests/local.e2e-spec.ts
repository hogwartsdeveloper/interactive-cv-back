import { App } from "../src/app";
import { boot } from "../src/main";
import request from "supertest";

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

describe("Local e2e", () => {
  it("create Local - error unauthorised", async () => {
    const res = await request(application.app)
      .post("/local")
      .send({ code: "test", name: { en: "test", ru: "", kz: "" } });

    expect(res.statusCode).toBe(401);
  });

  it("create Local - error role", async () => {
    const login = await request(application.app)
      .post("/user/login")
      .send({ email: "test@a.kz", password: "190908" });

    const res = await request(application.app)
      .post("/local")
      .set("Authorization", `Bearer ${login.body.jwt}`)
      .send({ code: "test", name: { en: "test", ru: "", kz: "" } });

    expect(res.statusCode).toBe(403);
  });

  it("create Local - success", async () => {
    const login = await request(application.app)
      .post("/user/login")
      .send({ email: "test@local.ru", password: "1909" });

    const res = await request(application.app)
      .post("/local")
      .set("Authorization", `Bearer ${login.body.jwt}`)
      .send({ code: "test4", name: { en: "test2", ru: "2", kz: "2" } });

    expect(res.statusCode).toBe(200);
    expect(res.body.result.code).toBe("test4");
  });

  it("get Locals", async () => {
    const res = await request(application.app).get("/local");

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBeTruthy();
  });

  it("remove Local", async () => {
    const login = await request(application.app)
      .post("/user/login")
      .send({ email: "test@local.ru", password: "1909" });

    const res = await request(application.app)
      .delete("/local")
      .query({ id: 1 })
      .set("Authorization", `Bearer ${login.body.jwt}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result.code).toBe("test");
  });

  it("update local", async () => {
    const login = await request(application.app)
      .post("/user/login")
      .send({ email: "test@local.ru", password: "1909" });

    const res = await request(application.app)
      .patch("/local")
      .set("Authorization", `Bearer ${login.body.jwt}`)
      .send({
        id: 2,
        code: "test2",
        name: { en: "test2", ru: "test2", kz: "test2" },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.result.code).toBe("test2");
  });
});

afterAll(() => {
  application.close();
});
