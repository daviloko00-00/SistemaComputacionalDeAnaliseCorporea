import prisma from "../database/prismaClient.js";
const usuariosRepository = {

  // CREATE
  criar: async (usuario) => {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senha_hash: usuario.senha_hash,
        data_nascimento: usuario.data_nascimento,
        ativo: usuario.ativo,
        email_verificado: usuario.email_verificado
      }
    });

    return novoUsuario;
  },

  // READ
  listar: async () => {
    return await prisma.usuario.findMany({
      orderBy: {
        id: "desc"
      }
    });
  },

  buscarPorId: async (id) => {
    return await prisma.usuario.findUnique({
      where: { id: Number(id) }
    });
  },

  buscarPorEmail: async (email) => {
    return await prisma.usuario.findUnique({
      where: { email }
    });
  },

  // UPDATE
  atualizar: async (id, usuario) => {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senha_hash: usuario.senha_hash,
        data_nascimento: usuario.data_nascimento,
        ativo: usuario.ativo,
        email_verificado: usuario.email_verificado
      }
    });

    return usuarioAtualizado;
  },

  // Atualizar apenas ultimo_login (muito usado no login)
  atualizarUltimoLogin: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        ultimo_login: new Date()
      }
    });
  },

  // DELETE
  deletar: async (id) => {
    return await prisma.usuario.delete({
      where: { id: Number(id) }
    });
  },

  // DESATIVAR (mais seguro que deletar)
  desativar: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        ativo: false
      }
    });
  },

  ativar: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        ativo: true
      }
    });
  },

  // EMAIL VERIFICADO
  verificarEmail: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        email_verificado: true
      }
    });
  }
};

export default usuariosRepository;