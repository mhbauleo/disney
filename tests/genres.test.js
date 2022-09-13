const { app, server } = require('../server')
const request = require("supertest");
const expect = require("chai").expect;
const { verifyJWT } = require("../helpers/jwt");
const User = require("../model/models/userModel");

const newUser = {
  email: "new@email.com",
  password: "1234",
};

describe("Genres", () => {
  let authToken;

  beforeEach(() => {
    jest.setTimeout('10000')
})
  beforeAll(async () => {
    await User.destroy({ truncate: true, cascade: false });

    let response = await request(app).post("/auth/register").send(newUser);
    expect(response.body.status).to.eql("success");
    expect(response.body.data).to.eql(null);
    expect(response.status).to.eql(201);

    response = await request(app).post("/auth/login").send(newUser);
    authToken = response.body.data;
    const payload = verifyJWT(authToken);
    expect(response.body.status).to.eql("success");
    expect(payload.email).to.eql(newUser.email);
    expect(response.status).to.eql(200);
  });

  afterAll(async () => {
    await User.destroy({ truncate: true, cascade: false });
    server.close();
  });

  describe("GET /genres", () => {
    test("Genres ok", async () => {
      let response = await request(app)
        .get("/genres")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body?.status).to.eql("success");
      expect(response.body?.data).to.be.an("array");
      expect(response.status).to.eql(200);
    });
  });
});
