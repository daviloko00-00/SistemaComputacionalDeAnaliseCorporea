import usuariosRepository from "../repositories/usuariosRepository.js";
import emailTokenRepository from "../repositories/emailTokenRepository.js";
import { gerarHashSenha } from "../utils/senhaHash.js";
import { gerarEmailTokenJWT } from "../utils/gerarTokens.js";
import { enviarEmailVerificacao } from "../services/emailService.js";
import { Usuario } from "../models/Usuarios.js";

const authController = {

  // CADASTRO
  criar: async (req, res) => {
    try {
      const { nome, email, senha, data_nascimento } = req.body;

      if (!senha || senha.trim() === "") {
        return res.status(400).json({ erro: "Adicione uma senha válida" });
      }

      const existe = await usuariosRepository.buscarPorEmail(email);
      if (existe) {
        return res.status(400).json({ erro: "Email já cadastrado" });
      }

      const senha_hash = await gerarHashSenha(senha);

      const usuario = Usuario.criar({
        nome,
        email,
        senha_hash,
        data_nascimento
      });

      const novoUsuario = await usuariosRepository.criar(usuario);

      // apagar tokens antigos
      await emailTokenRepository.deletarPorUsuario(novoUsuario.id);

      //  IMPORTANTE: gerar token com id do usuário
      const token = gerarEmailTokenJWT(novoUsuario.id);

      const expira_em = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

      await emailTokenRepository.criar(novoUsuario.id, token, expira_em);

      const link = `${process.env.FRONT_URL}/verificar-email?token=${token}`;

      await enviarEmailVerificacao(novoUsuario.email, link);

      return res.status(201).json({
        msg: "Usuário criado! Verifique seu email para ativar a conta."
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  // VERIFICAR EMAIL
  verificarEmail: async (req, res) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ erro: "Token não informado" });
      }

      const tokenEncontrado = await emailTokenRepository.buscarPorToken(token);

      if (!tokenEncontrado) {
        return res.status(400).json({ erro: "Token inválido ou já utilizado" });
      }

      if (new Date(tokenEncontrado.expira_em) < new Date()) {
        return res.status(400).json({ erro: "Token expirado" });
      }

      await usuariosRepository.verificarEmail(tokenEncontrado.usuarioId);

      await emailTokenRepository.deletar(tokenEncontrado.id);

      return res.status(200).json({ msg: "Email verificado com sucesso!" });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

};

export default authController;