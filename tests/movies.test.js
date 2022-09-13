const { app, server } = require("../server");
const request = require("supertest");
const expect = require("chai").expect;
const { verifyJWT } = require("../helpers/jwt");
const Genre = require("../model/models/genreModel");
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
  image: __dirname + "/images/movies/frozen.jpeg",
  title: "Frozen",
  date: "2014-01-02",
  stars: 3,
  genres: ["musical", "adventure"],
};
const endgame = {
  image: __dirname + "/images/movies/endgame.jpeg",
  title: "Avengers endgame",
  date: "2019-04-26",
  stars: 4,
  genres: ["action"],
};

describe("Movies", () => {
  let characters;
  let elsaId;
  let annaId;
  let spidermanId;
  let authToken;
  beforeEach(() => {
    jest.setTimeout(10000);
  });
  beforeAll(async () => {
    await Character.destroy({ truncate: { cascade: true } });
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

    characters = await Character.bulkCreate(newCharacters);
    const [charElsa] = characters.filter((char) => char.name === elsa.name);
    const [charAnna] = characters.filter((char) => char.name === anna.name);
    const [charSpiderman] = characters.filter(
      (char) => char.name === spiderman.name
    );
    elsaId = charElsa.id;
    annaId = charAnna.id;
    spidermanId = charSpiderman.id;
  });

  beforeEach(async () => {
    await Movie.destroy({ truncate: { cascade: true } });
  });

  afterAll(async () => {
    await User.destroy({ truncate: true, cascade: false });
    await Character.destroy({ truncate: { cascade: true } });
    await Movie.destroy({ truncate: { cascade: true } });
    server.close();
  });

  describe("POST /movies", () => {
    test("Valid token and valid movie", async () => {
      let response = await request(app)
        .post("/movies")
        .set("Authorization", `Bearer ${authToken}`)
        .field("title", frozen.title)
        .field("date", frozen.date)
        .field("stars", frozen.stars)
        .field("characterIds", [elsaId, annaId])
        .field("genres", frozen.genres)
        .attach("image", frozen.image);

      const movie = response.body?.data;
      expect(response.status).to.eql(201);
      expect(response.body?.status).to.eql("success");
      expect(movie.title).to.eql(frozen.title);
      expect(movie.date).to.eql(frozen.date);
      expect(movie.stars).to.eql(frozen.stars);
      expect(movie.image.includes(frozen.title)).to.eql(true);

      const movieFromDB = await Movie.findByPk(movie.id);
      expect(movieFromDB.title).to.eql(frozen.title);
      expect(movieFromDB.date).to.eql(frozen.date);
      expect(movieFromDB.stars).to.eql(frozen.stars);
      expect(movieFromDB.image.includes(frozen.title)).to.eql(true);
    });

    test("Valid movie without token", async () => {
      let response = await request(app)
        .post("/movies")
        .field("title", frozen.title)
        .field("date", frozen.date)
        .field("stars", frozen.stars)
        .field("characterIds", [elsaId, annaId])
        .field("genres", frozen.genres)
        .attach("image", frozen.image);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Movie with incomplete data", async () => {
      let response = await request(app)
        .post("/movies")
        .set("Authorization", `Bearer ${authToken}`)
        .field("title", frozen.title)
        .field("date", frozen.date);

      expect(response.status).to.eql(422);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("GET /movies", () => {
    let movie1;
    let movie2;
    let musical;
    let adventure;
    let action;

    beforeEach(async () => {
      movie1 = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie1.addCharacters([charElsa, charAnna]);
      await movie1.addGenres([musical, adventure]);

      movie2 = await Movie.create({
        title: endgame.title,
        date: endgame.date,
        stars: endgame.stars,
        image: endgame.image,
      });

      const [charSpiderman] = characters.filter(
        (char) => char.name === spiderman.name
      );
      action = await Genre.findOne({
        where: {
          name: "action",
        },
      });
      await movie2.addCharacters([charSpiderman]);
      await movie2.addGenres([action, adventure]);
    });

    test("Get all movies without query params", async () => {
      let response = await request(app)
        .get("/movies")
        .set("Authorization", `Bearer ${authToken}`);

      const moviesInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(moviesInResponse).to.be.a("array");
      expect(moviesInResponse.length).to.eql(2);

      const [frozenInResponse] = moviesInResponse.filter(
        (movie) => movie.title === frozen.title
      );
      const [endgameInResponse] = moviesInResponse.filter(
        (movie) => movie.title === endgame.title
      );
      expect(Object.keys(frozenInResponse).length).to.eql(3);
      expect(frozenInResponse.title).to.eql(frozen.title);
      expect(frozenInResponse.date).to.eql(frozen.date);
      expect(frozenInResponse.image).to.eql(frozen.image);

      expect(Object.keys(endgameInResponse).length).to.eql(3);
      expect(endgameInResponse.title).to.eql(endgame.title);
      expect(endgameInResponse.date).to.eql(endgame.date);
      expect(frozenInResponse.image).to.eql(frozen.image);
    });

    test("Filter movies by title", async () => {
      let response = await request(app)
        .get(`/movies?title=${frozen.title}`)
        .set("Authorization", `Bearer ${authToken}`);

      const moviesInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(moviesInResponse).to.be.a("array");
      expect(moviesInResponse.length).to.eql(1);
      const [movieInResponse] = moviesInResponse;

      expect(Object.keys(movieInResponse).length).to.eql(6);
      expect(movieInResponse.id).to.eql(movie1.id);
      expect(movieInResponse.image).to.eql(frozen.image);
      expect(movieInResponse.title).to.eql(frozen.title);
      expect(movieInResponse.date).to.eql(frozen.date);
      expect(movieInResponse.stars).to.eql(frozen.stars);

      expect(movieInResponse.genres).to.be.a("array");
      expect(movieInResponse.genres.length).to.eql(2);
      const [musicalInResponse] = movieInResponse.genres.filter(
        (genre) => genre.name === "musical"
      );
      const [adventureInResponse] = movieInResponse.genres.filter(
        (genre) => genre.name === "adventure"
      );

      expect(musicalInResponse.id).to.eql(musical.id);
      expect(musicalInResponse.name).to.eql(musical.name);
      expect(musicalInResponse.image).to.eql(musical.image);

      expect(adventureInResponse.id).to.eql(adventure.id);
      expect(adventureInResponse.name).to.eql(adventure.name);
      expect(adventureInResponse.image).to.eql(adventure.image);
    });

    test("Filter movies by stars", async () => {
      let response = await request(app)
        .get(`/movies?stars=${frozen.stars}`)
        .set("Authorization", `Bearer ${authToken}`);

      const moviesInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(moviesInResponse).to.be.a("array");
      expect(moviesInResponse.length).to.eql(1);
      const [movieInResponse] = moviesInResponse;

      expect(Object.keys(movieInResponse).length).to.eql(6);
      expect(movieInResponse.id).to.eql(movie1.id);
      expect(movieInResponse.image).to.eql(frozen.image);
      expect(movieInResponse.title).to.eql(frozen.title);
      expect(movieInResponse.date).to.eql(frozen.date);
      expect(movieInResponse.stars).to.eql(frozen.stars);

      expect(movieInResponse.genres).to.be.a("array");
      expect(movieInResponse.genres.length).to.eql(2);
      const [musicalInResponse] = movieInResponse.genres.filter(
        (genre) => genre.name === "musical"
      );
      const [adventureInResponse] = movieInResponse.genres.filter(
        (genre) => genre.name === "adventure"
      );

      expect(musicalInResponse.id).to.eql(musical.id);
      expect(musicalInResponse.name).to.eql(musical.name);
      expect(musicalInResponse.image).to.eql(musical.image);

      expect(adventureInResponse.id).to.eql(adventure.id);
      expect(adventureInResponse.name).to.eql(adventure.name);
      expect(adventureInResponse.image).to.eql(adventure.image);
    });

    test("Filter movies by genre", async () => {
      let response = await request(app)
        .get(`/movies?genre=${musical.id}`)
        .set("Authorization", `Bearer ${authToken}`);
      const moviesInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(moviesInResponse).to.be.a("array");
      expect(moviesInResponse.length).to.eql(1);
      const [movieInResponse] = moviesInResponse;

      expect(Object.keys(movieInResponse).length).to.eql(6);
      expect(movieInResponse.id).to.eql(movie1.id);
      expect(movieInResponse.image).to.eql(frozen.image);
      expect(movieInResponse.title).to.eql(frozen.title);
      expect(movieInResponse.date).to.eql(frozen.date);
      expect(movieInResponse.stars).to.eql(frozen.stars);

      expect(movieInResponse.genres).to.be.a("array");
      expect(movieInResponse.genres.length).to.eql(1);
      const [musicalInResponse] = movieInResponse.genres.filter(
        (genre) => genre.name === "musical"
      );

      expect(musicalInResponse.id).to.eql(musical.id);
      expect(musicalInResponse.name).to.eql(musical.name);
      expect(musicalInResponse.image).to.eql(musical.image);
    });

    test("Filter movies by order ASC", async () => {
      let response = await request(app)
        .get(`/movies?order=ASC`)
        .set("Authorization", `Bearer ${authToken}`);
      const moviesInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(moviesInResponse).to.be.a("array");
      expect(moviesInResponse.length).to.eql(2);

      expect(Object.keys(moviesInResponse[0]).length).to.eql(6);
      expect(moviesInResponse[0].id).to.eql(movie1.id);
      expect(moviesInResponse[0].image).to.eql(frozen.image);
      expect(moviesInResponse[0].title).to.eql(frozen.title);
      expect(moviesInResponse[0].date).to.eql(frozen.date);
      expect(moviesInResponse[0].stars).to.eql(frozen.stars);

      expect(Object.keys(moviesInResponse[1]).length).to.eql(6);
      expect(moviesInResponse[1].id).to.eql(movie2.id);
      expect(moviesInResponse[1].image).to.eql(endgame.image);
      expect(moviesInResponse[1].title).to.eql(endgame.title);
      expect(moviesInResponse[1].date).to.eql(endgame.date);
      expect(moviesInResponse[1].stars).to.eql(endgame.stars);

      expect(moviesInResponse[0].genres).to.be.a("array");
      expect(moviesInResponse[0].genres.length).to.eql(2);
      expect(moviesInResponse[1].genres).to.be.a("array");
      expect(moviesInResponse[1].genres.length).to.eql(2);
      const [musicalInResponse] = moviesInResponse[0].genres.filter(
        (genre) => genre.name === "musical"
      );
      const [adventureInResponse] = moviesInResponse[0].genres.filter(
        (genre) => genre.name === "adventure"
      );
      const [actionInResponse] = moviesInResponse[1].genres.filter(
        (genre) => genre.name === "action"
      );
      const [adventureEndgame] = moviesInResponse[1].genres.filter(
        (genre) => genre.name === "adventure"
      );

      expect(musicalInResponse.id).to.eql(musical.id);
      expect(musicalInResponse.name).to.eql(musical.name);
      expect(musicalInResponse.image).to.eql(musical.image);

      expect(adventureInResponse.id).to.eql(adventure.id);
      expect(adventureInResponse.name).to.eql(adventure.name);
      expect(adventureInResponse.image).to.eql(adventure.image);

      expect(actionInResponse.id).to.eql(action.id);
      expect(actionInResponse.name).to.eql(action.name);
      expect(actionInResponse.image).to.eql(action.image);

      expect(adventureEndgame.id).to.eql(adventure.id);
      expect(adventureEndgame.name).to.eql(adventure.name);
      expect(adventureEndgame.image).to.eql(adventure.image);
    });

    test("Filter movies by order DESC", async () => {
      let response = await request(app)
        .get(`/movies?order=DESC`)
        .set("Authorization", `Bearer ${authToken}`);
      const moviesInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(moviesInResponse).to.be.a("array");
      expect(moviesInResponse.length).to.eql(2);

      expect(Object.keys(moviesInResponse[1]).length).to.eql(6);
      expect(moviesInResponse[1].id).to.eql(movie1.id);
      expect(moviesInResponse[1].image).to.eql(frozen.image);
      expect(moviesInResponse[1].title).to.eql(frozen.title);
      expect(moviesInResponse[1].date).to.eql(frozen.date);
      expect(moviesInResponse[1].stars).to.eql(frozen.stars);

      expect(Object.keys(moviesInResponse[0]).length).to.eql(6);
      expect(moviesInResponse[0].id).to.eql(movie2.id);
      expect(moviesInResponse[0].image).to.eql(endgame.image);
      expect(moviesInResponse[0].title).to.eql(endgame.title);
      expect(moviesInResponse[0].date).to.eql(endgame.date);
      expect(moviesInResponse[0].stars).to.eql(endgame.stars);

      expect(moviesInResponse[0].genres).to.be.a("array");
      expect(moviesInResponse[0].genres.length).to.eql(2);
      expect(moviesInResponse[1].genres).to.be.a("array");
      expect(moviesInResponse[1].genres.length).to.eql(2);
      const [musicalInResponse] = moviesInResponse[1].genres.filter(
        (genre) => genre.name === "musical"
      );
      const [adventureInResponse] = moviesInResponse[1].genres.filter(
        (genre) => genre.name === "adventure"
      );
      const [actionInResponse] = moviesInResponse[0].genres.filter(
        (genre) => genre.name === "action"
      );
      const [adventureFrozen] = moviesInResponse[0].genres.filter(
        (genre) => genre.name === "adventure"
      );

      expect(musicalInResponse.id).to.eql(musical.id);
      expect(musicalInResponse.name).to.eql(musical.name);
      expect(musicalInResponse.image).to.eql(musical.image);

      expect(adventureInResponse.id).to.eql(adventure.id);
      expect(adventureInResponse.name).to.eql(adventure.name);
      expect(adventureInResponse.image).to.eql(adventure.image);

      expect(actionInResponse.id).to.eql(action.id);
      expect(actionInResponse.name).to.eql(action.name);
      expect(actionInResponse.image).to.eql(action.image);

      expect(adventureFrozen.id).to.eql(adventure.id);
      expect(adventureFrozen.name).to.eql(adventure.name);
      expect(adventureFrozen.image).to.eql(adventure.image);
    });

    test("Invalid param", async () => {
      let response = await request(app)
        .get("/movies?param=2")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      let response = await request(app).get("/movies");

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("GET /movies/:id", () => {
    test("Get existing movie", async () => {
      const movie = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      const musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      const adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie.addCharacters([charElsa, charAnna]);
      await movie.addGenres([musical, adventure]);

      let response = await request(app)
        .get(`/movies/${movie.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      const movieInResponse = response.body?.data;
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");

      expect(Object.keys(movieInResponse).length).to.eql(7);
      expect(movieInResponse.id).to.eql(movie.id);
      expect(movieInResponse.title).to.eql(movie.title);
      expect(movieInResponse.date).to.eql(movie.date);
      expect(movieInResponse.stars).to.eql(movie.stars);

      const [elsaFromRes] = movieInResponse.characters.filter(
        (char) => char.id === elsaId
      );
      const [annaFromRes] = movieInResponse.characters.filter(
        (char) => char.id === annaId
      );

      expect(elsaFromRes.id).to.eql(elsaId);
      expect(elsaFromRes.name).to.eql(elsa.name);
      expect(elsaFromRes.age).to.eql(elsa.age);
      expect(elsaFromRes.weight).to.eql(elsa.weight);
      expect(elsaFromRes.story).to.eql(elsa.story);

      expect(annaFromRes.id).to.eql(annaId);
      expect(annaFromRes.name).to.eql(anna.name);
      expect(annaFromRes.age).to.eql(anna.age);
      expect(annaFromRes.weight).to.eql(anna.weight);
      expect(annaFromRes.story).to.eql(anna.story);

      expect(movieInResponse.genres.length).to.eql(2);
      const genreNames = movieInResponse.genres.map((genre) => genre.name);
      expect(genreNames.includes("musical")).to.eql(true);
      expect(genreNames.includes("adventure")).to.eql(true);
    });

    test("Movie not found", async () => {
      let response = await request(app)
        .get(`/movies/123`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.eql(404);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      const movie = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      const musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      const adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie.addCharacters([charElsa, charAnna]);
      await movie.addGenres([musical, adventure]);

      let response = await request(app).get(`/movies/${movie.id}`);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("PUT /movies/:id", () => {
    test("Update existing movie", async () => {
      const movie = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      const musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      const adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie.addCharacters([charElsa, charAnna]);
      await movie.addGenres([musical, adventure]);

      let response = await request(app)
        .put(`/movies/${movie.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("title", endgame.title)
        .field("date", endgame.date)
        .field("stars", endgame.stars)
        .field("characterIds[0]", spidermanId)
        .field("genres[0]", endgame.genres[0])
        .attach("image", endgame.image);

      const movieInResponse = await Movie.findByPk(movie.id);
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(response.body?.data).to.eql(null);
      expect(movieInResponse.image.includes(endgame.title)).to.eql(true);
      expect(movieInResponse.title).to.eql(endgame.title);
      expect(movieInResponse.date).to.eql(endgame.date);
      expect(movieInResponse.stars).to.eql(endgame.stars);
    });

    test("Movie does not exist", async () => {
      let response = await request(app)
        .put(`/movies/123`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("title", endgame.title)
        .field("date", endgame.date)
        .field("stars", endgame.stars)
        .field("characterIds[0]", spidermanId)
        .field("genres[0]", endgame.genres[0])
        .attach("image", endgame.image);

      expect(response.status).to.eql(404);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Missing field", async () => {
      const movie = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      const musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      const adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie.addCharacters([charElsa, charAnna]);
      await movie.addGenres([musical, adventure]);

      let response = await request(app)
        .put(`/movies/${movie.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("title", endgame.title)
        .field("date", endgame.date)
        .field("stars", endgame.stars)
        .field("characterIds[0]", spidermanId)
        .field("genres[0]", endgame.genres[0]);

      expect(response.status).to.eql(422);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      const movie = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      const musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      const adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie.addCharacters([charElsa, charAnna]);
      await movie.addGenres([musical, adventure]);

      let response = await request(app)
        .put(`/movies/${movie.id}`)
        .field("title", endgame.title)
        .field("date", endgame.date)
        .field("stars", endgame.stars)
        .field("characterIds[0]", spidermanId)
        .field("genres[0]", endgame.genres[0])
        .attach("image", endgame.image);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });

  describe("DELETE /movies/:id", () => {
    test("Delete existing movie", async () => {
      const movie = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      const musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      const adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie.addCharacters([charElsa, charAnna]);
      await movie.addGenres([musical, adventure]);

      let response = await request(app)
        .delete(`/movies/${movie.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      const nullMovie = await Movie.findByPk(movie.id);
      expect(response.status).to.eql(200);
      expect(response.body?.status).to.eql("success");
      expect(response.body?.data).to.eql(null);
      expect(nullMovie).to.eql(null);
    });

    test("Movie does not exist", async () => {
      let response = await request(app)
        .delete(`/movies/123`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.eql(404);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });

    test("Without token", async () => {
      const movie = await Movie.create({
        title: frozen.title,
        date: frozen.date,
        stars: frozen.stars,
        image: frozen.image,
      });
      const [charElsa] = characters.filter((char) => char.name === elsa.name);
      const [charAnna] = characters.filter((char) => char.name === anna.name);
      const musical = await Genre.findOne({
        where: {
          name: "musical",
        },
      });
      const adventure = await Genre.findOne({
        where: {
          name: "adventure",
        },
      });
      await movie.addCharacters([charElsa, charAnna]);
      await movie.addGenres([musical, adventure]);

      let response = await request(app).delete(`/movies/${movie.id}`);

      expect(response.status).to.eql(400);
      expect(response.body?.status).to.eql("fail");
      expect(response.body.data?.message).to.be.a("string");
    });
  });
});
