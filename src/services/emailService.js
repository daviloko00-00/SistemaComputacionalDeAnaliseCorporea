import { transporter } from "../config/email.js";

export const enviarEmailVerificacao = async (email, link) => {
  await transporter.sendMail({
    from: `"Sistema" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verificação de Email",
    html: `
      <h1>VERIFIQUE SEU EMAIL</h1>
      <p>muito obrigado por utilizar o sistema de média de cálculos para taxas metabólicas </p>
      <h2>Confirme seu email</h2>
      <p>Clique no link abaixo para verificar:</p>
      <a href="${link}">${link}</a>
      <h1>Você possui uma hora até a expiração do token<h1>
      <p>Não responda esse email</p>
    `
  });
};