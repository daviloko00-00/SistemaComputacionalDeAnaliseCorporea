import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", authController.criar);
router.get("/verificar-email", authController.verificarEmail);

export default router;