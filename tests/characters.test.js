const { app, server } = require('../server')
const request = require("supertest");
const expect = require("chai").expect;
const { verifyJWT } = require("../helpers/jwt");
const User = require("../model/models/userModel");
const Movie = require("../model/models/movieModel");
const Character = require("../model/models/characterModel");

const newUser = {
  email: "new@email.com",
  password: "1234",
};

const elsa = {
  image: "images/Elsa-1662402137724.jpeg",
  name: "Elsa",
  age: 21,
  weight: 54,
  story:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};

const anna = {
  image: "images/Anna-1662402137724.jpeg",
  name: "Anna",
  age: 18,
  weight: 54,
  story:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};

const spiderman = {
  image: "images/Spiderman-1662325334766.jpeg",
  name: "Spiderman",
  age: 16,
  weight: 70,
  story:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};
const newCharacters = [elsa, anna, spiderman];
const frozen = {
  image: "images/frozen.jpeg",
  title: "Frozen",
  date: "2014-01-02",
  stars: 3,
};

describe("Characters", () => {
  let authToken;

  beforeEach(() => {
    jest.setTimeout('10000')
})

  beforeAll(async () => {
    await Character.destroy({ truncate: { cascade: true } });
    await Movie.destroy({ truncate: { cascade: true } });
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
    await Character.destroy({ truncate: { cascade: true } });
    await Movie.destroy({ truncate: { cascade: true } });
    server.close();
  });

  describe("POST /characters", () => {
    afterAll(async () => {
      await Character.destroy({ truncate: { cascade: true } });
    });

    test("Valid token and valid character", async () => {
      let response = await request(app)
        .post("/characters")
        .set("Authorization", `Bearer ${authToken}`)
        .field("name", elsa.name)
        .field("age", elsa.age)
        .field("weight", elsa.weight)
        .field("story", elsa.story)
        .attach("image", __dirname + "/images/characters/elsa.jpeg");

      expect(response.status).to.eql(201);
      expect(response.body?.status).to.eql("success");
      expect(response.body?.data?.name).to.eql(elsa.name);
      expect(Number(response.body?.data?.age)).to.eql(elsa.age);
      expect(Number(response.body?.data?.weight)).to.eql(elsa.weight);
      expect(response.body?.data?.story).to.eql(elsa.story);
      expect(response.body?.data?.image.includes(elsa.name)).to.eql(true);

      const char = await Character.findByPk(response.body.data.id);

      expect(char.name).to.eql(elsa.name);
      expect(char.age).to.eql(elsa.age);
      expect(char.weight).to.eql(elsa.weight);
      expect(char.story).to.eql(elsa.story);
      expect(char.image.includes(elsa.name)).to.eql(true);
    });

    test("Valid character without token", async () => {
      let response = await request(app).post("/characters").send(elsa);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Character with  incomplete data", async () => {
      let response = await request(app)
        .post("/characters")
        .send({ name: elsa.name, age: elsa.age, story: elsa.story })
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.eql(422);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("GET /characters", () => {
    let characters;
    let elsaId;
    let annaId;
    let movie;

    beforeAll(async () => {
      characters = await Character.bulkCreate(newCharacters);
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      elsaId = charElsa.id;
      annaId = charAnna.id;
      movie = await Movie.create(frozen);
      await movie.addCharacters([charElsa, charAnna]);
    });

    afterAll(async () => {
      await Character.destroy({ truncate: { cascade: true } });
      await Movie.destroy({ truncate: { cascade: true } });
    });

    test("Get all characters without query params", async () => {
      let response = await request(app)
        .get("/characters")
        .set("Authorization", `Bearer ${authToken}`);

      const charactersInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(charactersInResponse).to.be.a("array");
      expect(charactersInResponse.length).to.eql(characters.length);

      for (let i = 0; i < charactersInResponse.length; i++) {
        expect(Object.keys(charactersInResponse[i]).length).to.eql(2);
        expect(charactersInResponse[i].image).to.eql(characters[i].image);
        expect(charactersInResponse[i].name).to.eql(characters[i].name);
      }
    });

    test("Filter characters by name", async () => {
      let response = await request(app)
        .get(`/characters?name=${elsa.name}`)
        .set("Authorization", `Bearer ${authToken}`);

      const charactersInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(charactersInResponse).to.be.a("array");
      expect(charactersInResponse.length).to.eql(1);
      const [charInResponse] = charactersInResponse;

      expect(Object.keys(charInResponse).length).to.eql(7);
      expect(charInResponse.id).to.eql(elsaId);
      expect(charInResponse.image.includes(elsa.name)).to.eql(true);
      expect(charInResponse.name).to.eql(elsa.name);
      expect(charInResponse.age).to.eql(elsa.age);
      expect(charInResponse.weight).to.eql(elsa.weight);
      expect(charInResponse.story).to.eql(elsa.story);
      expect(charInResponse.movies[0].id).to.eql(movie.id);
      expect(charInResponse.movies[0].image).to.eql(movie.image);
      expect(charInResponse.movies[0].title).to.eql(movie.title);
      expect(charInResponse.movies[0].date).to.eql(movie.date);
      expect(charInResponse.movies[0].stars).to.eql(movie.stars);
    });

    test("Filter characters by age", async () => {
      let response = await request(app)
        .get(`/characters?age=${elsa.age}`)
        .set("Authorization", `Bearer ${authToken}`);

      const charactersInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(charactersInResponse).to.be.a("array");
      expect(charactersInResponse.length).to.eql(1);
      const [charInResponse] = charactersInResponse;

      expect(Object.keys(charInResponse).length).to.eql(7);
      expect(charInResponse.id).to.eql(elsaId);
      expect(charInResponse.image.includes(elsa.name)).to.eql(true);
      expect(charInResponse.name).to.eql(elsa.name);
      expect(charInResponse.age).to.eql(elsa.age);
      expect(charInResponse.weight).to.eql(elsa.weight);
      expect(charInResponse.story).to.eql(elsa.story);
      expect(charInResponse.movies[0].id).to.eql(movie.id);
      expect(charInResponse.movies[0].image).to.eql(movie.image);
      expect(charInResponse.movies[0].title).to.eql(movie.title);
      expect(charInResponse.movies[0].date).to.eql(movie.date);
      expect(charInResponse.movies[0].stars).to.eql(movie.stars);
    });

    test("Filter characters by weight", async () => {
      let response = await request(app)
        .get(`/characters?weight=${elsa.weight}`)
        .set("Authorization", `Bearer ${authToken}`);

      const charactersInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(charactersInResponse).to.be.a("array");
      expect(charactersInResponse.length).to.eql(2);
      const [charInResponse] = charactersInResponse;

      expect(Object.keys(charInResponse).length).to.eql(7);
    });

    test("Filter characters by movies", async () => {
      let response = await request(app)
        .get(`/characters?movies=${movie.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      const charactersInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(charactersInResponse).to.be.a("array");
      expect(charactersInResponse.length).to.eql(2);
      const [charInResponse] = charactersInResponse;

      expect(Object.keys(charInResponse).length).to.eql(7);
    });

    test("Invalid param", async () => {
      let response = await request(app)
        .get("/characters?param=2")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      let response = await request(app).get("/characters");

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("GET /characters/:id", () => {
    let characters;
    let elsaId;
    let movie;
    let existingCharIds;

    beforeAll(async () => {
      characters = await Character.bulkCreate(newCharacters);
      existingCharIds = characters.map((char) => char.id);
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      elsaId = charElsa.id;
      movie = await Movie.create(frozen);
      await movie.addCharacters([charElsa, charAnna]);
    });

    afterAll(async () => {
      await Character.destroy({ truncate: { cascade: true } });
      await Movie.destroy({ truncate: { cascade: true } });
    });

    test("Get existing character", async () => {
      let response = await request(app)
        .get(`/characters/${elsaId}`)
        .set("Authorization", `Bearer ${authToken}`);

      const characterInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");

      expect(Object.keys(characterInResponse).length).to.eql(7);
      expect(characterInResponse.id).to.eql(elsaId);
      expect(characterInResponse.image.includes(elsa.name)).to.eql(true);
      expect(characterInResponse.name).to.eql(elsa.name);
      expect(characterInResponse.age).to.eql(elsa.age);
      expect(characterInResponse.weight).to.eql(elsa.weight);
      expect(characterInResponse.story).to.eql(elsa.story);
      expect(characterInResponse.movies[0].id).to.eql(movie.id);
      expect(characterInResponse.movies[0].image).to.eql(movie.image);
      expect(characterInResponse.movies[0].title).to.eql(movie.title);
      expect(characterInResponse.movies[0].date).to.eql(movie.date);
      expect(characterInResponse.movies[0].stars).to.eql(movie.stars);
    });

    test("Character does not exist", async () => {
      // Get char id that doesn't exist
      let id = 1;
      while (existingCharIds.includes(id)) {
        id++;
      }

      let response = await request(app)
        .get(`/characters/${id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.eql(404);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      let response = await request(app).get(`/characters/${elsaId}`);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("PUT /characters/:id", () => {
    let characters;
    let elsaId;
    let existingCharIds;

    beforeAll(async () => {
      characters = await Character.bulkCreate(newCharacters);
      existingCharIds = characters.map((char) => char.id);
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      elsaId = charElsa.id;
    });

    afterAll(async () => {
      await Character.destroy({ truncate: { cascade: true } });
      await Movie.destroy({ truncate: { cascade: true } });
    });

    test("Update existing character", async () => {
      let response = await request(app)
        .put(`/characters/${elsaId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("name", anna.name)
        .field("age", elsa.age)
        .field("weight", spiderman.weight)
        .field("story", anna.story)
        .attach("image", __dirname + "/images/characters/wanda.jpeg");

      const characterInResponse = await Character.findByPk(elsaId);
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(response.body?.data).to.eql(null);
      expect(characterInResponse.image.includes(anna.name)).to.eql(true);
      expect(characterInResponse.name).to.eql(anna.name);
      expect(characterInResponse.age).to.eql(elsa.age);
      expect(characterInResponse.weight).to.eql(spiderman.weight);
      expect(characterInResponse.story).to.eql(anna.story);
    });

    test("Character does not exist", async () => {
      // Get char id that doesn't exist
      let id = 1;
      while (existingCharIds.includes(id)) {
        id++;
      }

      let response = await request(app)
        .put(`/characters/${id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("name", anna.name)
        .field("age", elsa.age)
        .field("weight", spiderman.weight)
        .field("story", anna.story)
        .attach("image", __dirname + "/images/characters/wanda.jpeg");

      expect(response.status).to.eql(404);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Missing field", async () => {
      let response = await request(app)
        .put(`/characters/${elsaId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("name", anna.name)
        .field("weight", spiderman.weight)
        .field("story", anna.story);

      expect(response.status).to.eql(422);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      let response = await request(app).put(`/characters/${elsaId}`);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("DELETE /characters/:id", () => {
    let characters;
    let elsaId;
    let existingCharIds;

    beforeAll(async () => {
      characters = await Character.bulkCreate(newCharacters);
      existingCharIds = characters.map((char) => char.id);
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      elsaId = charElsa.id;
    });

    afterAll(async () => {
      await Character.destroy({ truncate: { cascade: true } });
      await Movie.destroy({ truncate: { cascade: true } });
    });

    test("Delete existing character", async () => {
      let response = await request(app)
        .delete(`/characters/${elsaId}`)
        .set("Authorization", `Bearer ${authToken}`);

      const characterInResponse = await Character.findByPk(elsaId);
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(response.body?.data).to.eql(null);
      expect(characterInResponse).to.eql(null);
    });

    test("Character does not exist", async () => {
      // Get char id that doesn't exist
      let id = 1;
      while (existingCharIds.includes(id)) {
        id++;
      }

      let response = await request(app)
        .delete(`/characters/${id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.eql(404);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      let response = await request(app).delete(`/characters/${elsaId}`);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });
});
