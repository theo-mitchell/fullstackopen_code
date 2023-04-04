const bcrypt = require("bcrypt");
const User = require("../models/user");
const testHelper = require("./test_helper");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

describe("when there is one user in the db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);

    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("Creation succeds with a fresh username", async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: "test",
      name: "testerson",
      password: "yeslawd",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper status code if username already exists", async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: "root",
      name: "testerson",
      password: "yeslawd",
    };

    const result = await api
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await testHelper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});
