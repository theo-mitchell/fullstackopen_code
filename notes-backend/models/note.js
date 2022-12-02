require("dotenv-flow").config();
const mongoose = require("mongoose");

const login = encodeURIComponent(process.env.MONGODB_LOGIN);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const url = `mongodb+srv://${login}:${password}@cluster0.wvoz7g2.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.connect(url).then((result) => {
  console.log("---CONNECTED---");
}).catch((error) => {
    console.log('ERROR CONNECTING TO MONGODB:', error.message);
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
