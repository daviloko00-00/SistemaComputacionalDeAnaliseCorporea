import usuariosRepository from "../repositories/usuariosRepository.js";
import emailTokenRepository from "../repositories/emailTokenRepository.js";
import { gerarHashSenha, compararSenha } from "../utils/senhaHash.js";
import { gerarEmailTokenJWT, gerarTokenLogin } from "../utils/gerarTokens.js";
import { enviarEmailVerificacao } from "../services/emailService.js";
import { Usuario } from "../models/Usuarios.js";

/**
 * Controlador de autenticação e verificação de email.
 */
const authController = {

  /**
   * Cria um usuário, gera token de verificação e envia e-mail.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  criar: async (req, res) => {
    try {
      const { nome, email, senha, data_nascimento } = req.body;

      if (!senha || senha.trim() === "") {
        return res.status(400).json({ erro: "Adicione uma senha válida" });
      }

      if (!nome || !email || !data_nascimento) {
        return res.status(400).json({ erro: "Nome, email e data de nascimento são obrigatórios" });
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

      const link = `${process.env.FRONT_URL}?token=${token}`;

      await enviarEmailVerificacao(novoUsuario.email, link);

      return res.status(201).json({
        msg: "Usuário criado! Verifique seu email para ativar a conta."
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Login do usuário com email e senha.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
      }

      const usuario = await usuariosRepository.buscarPorEmail(email.trim().toLowerCase());

      if (!usuario) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      if (!usuario.ativo) {
        return res.status(403).json({ erro: "Conta desativada. Entre em contato com o administrador." });
      }

      if (!usuario.email_verificado) {
        return res.status(403).json({ erro: "Email não verificado. Verifique seu email primeiro." });
      }

      const senhaValida = await compararSenha(senha, usuario.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      // Atualizar último login
      await usuariosRepository.atualizarUltimoLogin(usuario.id);

      // Gerar token de acesso
      const token = gerarTokenLogin(usuario);

      return res.status(200).json({
        msg: "Login realizado com sucesso",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Verifica o email do usuário usando o token informado na querystring.
   * Se o token estiver expirado, remove o token e desativa o usuário.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
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
        // Token expirado: remove o token e desativa o usuário correspondente
        await emailTokenRepository.deletar(tokenEncontrado.id);
        await usuariosRepository.desativar(tokenEncontrado.usuarioId);

        return res.status(400).json({ erro: "Token expirado" });
      }

      await usuariosRepository.verificarEmail(tokenEncontrado.usuarioId);

      await emailTokenRepository.deletar(tokenEncontrado.id);

      return res.status(200).json({ msg: "Email verificado com sucesso!" });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Reenvia o email de verificação gerando um novo token.
   * Remove tokens antigos do usuário e envia novo link.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  reenviarEmail: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({ erro: "Informe o email" });
      }

      const usuario = await usuariosRepository.buscarPorEmail(email.trim().toLowerCase());

      // Mensagem genérica para não revelar se o email existe
      if (!usuario) {
        return res.status(200).json({ msg: "Se o email existir, enviaremos um novo link de verificação." });
      }

      // Recria o token (remove tokens antigos do usuário)
      await emailTokenRepository.deletarPorUsuario(usuario.id);

      const token = gerarEmailTokenJWT(usuario.id);
      const expira_em = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

      await emailTokenRepository.criar(usuario.id, token, expira_em);

      const link = `${process.env.FRONT_URL}?token=${token}`;
      await enviarEmailVerificacao(usuario.email, link);

      return res.status(200).json({ msg: "Novo link de verificação enviado para seu email." });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
};

export default authController;
