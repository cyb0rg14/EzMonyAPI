import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import { notFound, errorHandler } from "./middleware.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to EzMony API!</h1>");
});

// routes
app.use("/v1/auth", authRoutes);
app.use('/v1/')

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
