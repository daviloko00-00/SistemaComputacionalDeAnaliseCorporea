import { transporter } from "../config/email.js";

export const enviarEmailVerificacao = async (email, link) => {
  await transporter.sendMail({
    from: `"Sistema" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verificação de Email",
    html: `
      <h2>Confirme seu email</h2>
      <p>Clique no link abaixo para verificar:</p>
      <a href="${link}">${link}</a>
      <p>Não responda esse email<p>
    `
  });
};