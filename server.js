const express = require("express");
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes")
const projectRoutes = require("./routes/projectRoutes")
const widgetRoutes = require("./routes/widgetRoutes")
const bodyParser = require('body-parser');
const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

require('dotenv').config();

connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, this is the root route!");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ origin: '*' }));

app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/widget", widgetRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server started on port ${PORT}`.yellow.bold)
);