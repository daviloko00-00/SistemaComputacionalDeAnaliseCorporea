import jwt from "jsonwebtoken";

export const gerarEmailTokenJWT = (usuarioId) => {
  return jwt.sign(
    { usuarioId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const validarEmailTokenJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};