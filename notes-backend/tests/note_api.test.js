const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

const Note = require("../models/note");

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];

beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

test("notes are returned as json", async () => {
  await request(app)
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("all notes are returned", async () => {
  const response = await request(app)
    .get("/api/notes")
    .catch((err) => console.log("HA", err));

  expect(response.body).toHaveLength(initialNotes.length);
}, 100000);

test("a specific note is within the returned notes", async () => {
  const response = await request(app).get("/api/notes");

  const contents = response.body.map((r) => r.content);
  expect(contents).toContain("Browser can execute only Javascript");

  expect(response.body[0].content).toBe("HTML is easy");
});

afterAll(() => {
  mongoose.connection.close();
});
