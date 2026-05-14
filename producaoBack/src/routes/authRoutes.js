import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", authController.criar);
router.post("/login", authController.login);
router.get("/verificar-email", authController.verificarEmail);
router.post("/reenviar-email", authController.reenviarEmail);

export default router;
