import express from "express";
import { addEarnings } from "../controllers/user/earningsController.js";

const router = express.Router();

router.post("/add-earnings", addEarnings);

export default router;