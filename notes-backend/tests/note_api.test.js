const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const api = request(app);
const helper = require("../tests/test_helper");

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);
});

describe("when the notes are saved initially", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  }, 100000);

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((r) => r.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });
});

describe("viewing a specific note", () => {
  test("succeds with a valid id", async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("fails with code 400 if data is invalid", async () => {
    const invalidNote = new Note({ important: false });

    await api.post("/api/notes").send(invalidNote).expect(400);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe("note deletion", () => {
  test("succeeds with status 204 if note is deleted, no note content found", async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(notesAtStart.length - 1);

    const contents = notesAtEnd.map((note) => {
      note.content;
    });

    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
