import 'dotenv/config'
import routes from "./routes/routes.js";
import express from "express";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// aponta pra uploads (raiz) e mantém /uploads na URL
//caminho para upload de vídeos e imagens
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use('/' ,routes);

const PORT = process.env.SERVER_PORT || 8081;

app.listen(PORT, '0.0.0.0' ,  ()=>{
    console.log(`Servidor rodando em: http://localhost:${8081}`)
})
console.log(process.env.DB_HOST);