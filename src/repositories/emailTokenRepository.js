import prisma from "../database/prismaClient.js";

const emailTokenRepository = {

  criar: async (usuarioId, token, expira_em) => {
    return await prisma.emailVerificationToken.create({
      data: {
        usuarioId,
        token,
        expira_em
      }
    });
  },

  buscarPorToken: async (token) => {
    return await prisma.emailVerificationToken.findUnique({
      where: { token }
    });
  },

  deletar: async (id) => {
    return await prisma.emailVerificationToken.delete({
      where: { id }
    });
  },

  deletarPorUsuario: async (usuarioId) => {
    return await prisma.emailVerificationToken.deleteMany({
      where: { usuarioId }
    });
  }
};

export default emailTokenRepository;