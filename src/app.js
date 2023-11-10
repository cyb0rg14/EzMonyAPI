import express from "express";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import connectDB from "./config/db.js";
import waitlistRoutes from "./routes/waitlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { notFound, errorHandler } from "./middleware.js";
import "dotenv/config";

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

// routes
app.use("/v1", waitlistRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/profile/", profileRoutes);

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
