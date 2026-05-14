import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { autenticarToken } from "./middlewares/autenticarToken.js";

import authRoutes from "./routes/authRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";

dotenv.config();

const app = express();

// MIDDLEWARES GLOBAIS
app.use(cors({ origin: "*" }));
app.use(express.json());

// ROTAS PÚBLICAS
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);

// ROTA PROTEGIDA DE TESTE
app.get("/perfil", autenticarToken, (req, res) => {
  return res.status(200).json({
    msg: "Rota protegida",
    usuario: req.usuario
  });
});

// ROTA TESTE
app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "API rodando com sucesso"
  });
});

// TRATAMENTO DE ERROS (fallback)
app.use((err, req, res, next) => {
  console.error("Erro interno:", err);

  return res.status(500).json({
    erro: "Erro interno no servidor"
  });
});

export default app;
