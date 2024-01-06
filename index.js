const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
connectToMongo();
const app = express();
const port = process.env.PORT ;

app.use(cors());
app.use(express.json());

////Available routes ////
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

///Available routes//////

app.listen(port, () => {
  console.log(`Example app listeningon porttt: ${port}`);
});

////////////////////////////////////////////////////////////////////////////////////////////////////

// const connectToMongo = require("./db");
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();
// const port = 3006;

// app.use(cors());
// app.use(express.json());

// ////Available routes ////
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/notes", require("./routes/notes"));

// ///Available routes//////

// const startServer = async () => {
//   await connectToMongo(); // Wait for the database connection to complete
//   const collections = await mongoose.connection.db.listCollections().toArray();
//   const distinctValues = await mongoose.connection.db
//     .collection("users")
//     .distinct("name");
//   console.log("Distinct Values:", distinctValues, collections);

//   app.listen(port, () => {
//     console.log(`Example app listening on port: ${port}`);
//   });
// };

// startServer();
///////////////////////////////////////////////////////////////////////////////////////////
