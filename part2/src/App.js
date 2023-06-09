import noteService from "./services/notes";
import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";

const App = (props) => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    const handleUsernameChange = (value) => {
      setUsername(value);
    };

    const handlePasswordChange = (value) => {
      setPassword(value);
    };

    const handleLogin = async (event) => {
      event.preventDefault();

      console.log("Logging in with", username, password);

      try {
        const user = await loginService.login({
          username,
          password,
        });

        window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));

        noteService.setToken(user.token);

        setUser(user);
        setUsername("");
        setPassword("");
      } catch (exception) {
        setErrorMessage("Incorrect credentials");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
            handleSubmit={handleLogin}
          ></LoginForm>
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );

  useEffect(() => {
    const getNotes = async () => {
      const response = await noteService.getAll();
      setNotes(response);
    };

    getNotes();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note ${note.content} was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}

      <h2>Notes</h2>
      <ul>
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;
