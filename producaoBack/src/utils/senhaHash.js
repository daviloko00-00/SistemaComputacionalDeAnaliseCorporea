import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; //epresentam o fator de custo (ou complexidade) em algoritmos de hashing de senha, especificamente no bcrypt
//define quão complexo vai ser o a criptografia criada | quantas vezes será utilizado hash

export const gerarHashSenha = async (senha) => {
  if (!senha || senha.length < 6) {
    throw new Error("Senha deve ter no mínimo 6 caracteres");
  }

  return await bcrypt.hash(senha, SALT_ROUNDS);
};

export const compararSenha = async (senhaDigitada, senhaHash) => {
  if (!senhaDigitada || !senhaHash) {
    throw new Error("Senha inválida para comparação");
  }

  return await bcrypt.compare(senhaDigitada, senhaHash);
};