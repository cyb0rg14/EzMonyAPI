import express from "express";
import { addResponse } from "../controllers/responseController.js";

const router = express.Router();

router.post('/survey', addResponse);

export default router;