// import starter packages
import express from "express";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import "dotenv/config";

// import routes
import waitlistRoutes from "./routes/waitlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import adRoutes from "./routes/adRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";

// import database connection
import connectDB from "./config/db.js";

// import middleware
import { notFound, errorHandler } from "./middleware.js";

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to EzMony API!</h1>");
});

// declaring all routes
app.use("/v1", waitlistRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/survey", surveyRoutes);
app.use("/v1/ad", adRoutes);
app.use('/v1/video', videoRoutes);
app.use("/v1/reel", reelRoutes);

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

app.use(notFound);
app.use(errorHandler);

export default app;
