import express from "express";
import usuariosControllers from "../controllers/usuariosController";

const router = express.Router();

router.post("/usuarios", usuariosControllers.criarUsuario);
router.get("/usuarios", usuariosController.selecionarUsuario);

// verificação do email
router.get("/usuarios/verificar-email", usuariosController);

export default router;