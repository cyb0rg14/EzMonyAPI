const express = require("express");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const cors = require("cors");
const middlewares = require("./middleware");
const morgan = require("morgan"); 
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello World");
});

// routes
app.use("/api/v1/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
