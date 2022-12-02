require("dotenv-flow").config();
const mongoose = require("mongoose");

// This would check the password if it was supplied as an arg. We are not doing this here, see below.
// if (process.argv.length < 3) {
//     console.log('Please provide password as an argument: node mongo.js <password>');
// };

const login = encodeURIComponent(process.env.MONGODB_LOGIN);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
// console.table({ login, password });
const url = `mongodb+srv://${login}:${password}@cluster0.wvoz7g2.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)