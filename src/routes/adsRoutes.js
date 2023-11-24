import express from "express";
import {
    getAllAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd,
} from "../controllers/adsController.js";

const router = express.Router();

router.get("/", getAllAds);
router.post("/create", createAd);
router.route("/:id").get(getAdById).patch(updateAd).delete(deleteAd);

export default router;
