import express from "express";
import usuariosController from "../controllers/usuariosController.js";

const router = express.Router();

router.post("/", usuariosController.criarUsuario);
router.get("/", usuariosController.selecionarUsuario);

export default router;