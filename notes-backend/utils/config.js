require("dotenv-flow").config();

const PORT = process.env.PORT;

const login = encodeURIComponent(process.env.MONGODB_LOGIN);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);

// console.table({ login: login, password: password, port: PORT });

const URI = `mongodb+srv://${login}:${password}@cluster0.wvoz7g2.mongodb.net/noteApp?retryWrites=true&w=majority`;
const TEST_URI = `mongodb+srv://${login}:${password}@cluster0.wvoz7g2.mongodb.net/noteAppTest?retryWrites=true&w=majority`;

const MONGODB_URI = process.env.NODE_ENV === "test" ? TEST_URI : URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
