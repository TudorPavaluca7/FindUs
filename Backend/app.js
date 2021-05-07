const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// import mongoose
const mongoose = require("mongoose");
// load env variables
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const expressValidator = require("express-validator");
dotenv.config();

//db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

//routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const locationRoutes = require("./routes/location");
const eventRoutes = require("./routes/event");
const notificationRoutes = require("./routes/notification");
//apiDocs
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
      if (err) {
          res.status(400).json({
              error: err
          });
      }
      const docs = JSON.parse(data);
      res.json(docs);
  });
});

// middleware
app.use(morgan("dev")); //dev - development environment
// exprexx by itself doesn't parse the request body 
//every request body will be converted into json format 
//tells the system that you want json to be used
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
app.use("/", postRoutes); // use is a method to configure the middleware used by the routes of the Express HTTP server object.
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", locationRoutes);
app.use("/", eventRoutes);
app.use("/", notificationRoutes);
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized!" });
  }
});

//port listening
app.listen(8080, () => console.log("listening on port 8080"));
