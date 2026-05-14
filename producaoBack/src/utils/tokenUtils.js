import crypto from "crypto";

export const gerarTokenVerificacao = () => {
  return crypto.randomBytes(32).toString("hex");
};