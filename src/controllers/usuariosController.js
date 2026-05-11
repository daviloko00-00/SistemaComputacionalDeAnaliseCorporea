import usuariosRepository from "../repositories/usuariosRepository.js";
import { Usuario } from "../models/Usuarios.js";
import { gerarHashSenha } from "../utils/senhaHash.js";


const usuariosController = {

    criarUsuario: async (req, res) => {
        try {
            const {nome, email, senha, data_nascimento} = req.body
            if (!senha || senha === ''){
                return res.status().json({erro : "Adicione uma senha para cadastro"})
            }

            const senha_cripto = await gerarHashSenha(senha);
            
            
            const usuario = Usuario.criar({
                nome : nome,
                email : email,
                senha_hash : senha_cripto,
                data_nascimento : data_nascimento
            });

            const resultado = await usuariosRepository.criar(usuario);

            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    },
    selecionarUsuario : async (req, res) =>{
        try {
            const id = req.query.id;
            if(id){
                const resultado = await usuariosRepository.buscarPorId(id)
                return res.status(200).json(resultado)
            }
            const resultado = await usuariosRepository.listar();

            return res.status(200).json(resultado)
            
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    } 

}

export default usuariosController;