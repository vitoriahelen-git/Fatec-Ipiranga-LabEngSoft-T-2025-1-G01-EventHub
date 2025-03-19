import { Request, Response } from "express";
import { sequelize } from "../config/database";
import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario";
import UsuarioDao from "../dao/UsuarioDao";
import UsuarioTipoDao from "../dao/UsuarioTipoDao";
import { compararSenha, criptografarSenha } from "../utils/criptografiaSenha";
import enviarEmailRecuperacaoSenha from "../utils/enviaEmail";
import { cnpj, cpf } from "cpf-cnpj-validator";

export default class UsuarioController {
    private usuarioDao = new UsuarioDao();
    private usuarioTipoDao = new UsuarioTipoDao();

    public cadastrarUsuario = async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        for(let atributo in req.body){
            if(req.body[atributo] === ''){
                req.body[atributo] = null;
            }
        }
        try{
            const { organizador, prestador, emailUsu, senhaUsu, nomeUsu, sobrenomeUsu, dtNasUsu, telUsu, cpfUsu, nomeEmpresa, telEmpresa, cnpjEmpresa, localizacaoEmpresa } = req.body;

            const usuarioPorEmail: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(emailUsu, transaction);
            if(usuarioPorEmail){
                await transaction.rollback();
                res.status(409).json({mensagem: "E-mail já cadastrado"});
                return;
            }

            if(cpfUsu){
                if(!cpf.isValid(cpfUsu)){
                    await transaction.rollback();
                    res.status(400).json({mensagem: "CPF inválido"});
                    return;
                }
                const usuarioPorCpf: Usuario| null = await this.usuarioDao.buscarUsuarioPorCpf(cpfUsu, transaction);
                if(usuarioPorCpf){
                    await transaction.rollback();
                    res.status(409).json({mensagem: "CPF já cadastrado"});
                    return;
                }
            }

            if(cnpjEmpresa){
                if(!cnpj.isValid(cnpjEmpresa)){
                    await transaction.rollback();
                    res.status(400).json({mensagem: "CNPJ inválido"});
                    return;
                }
                const usuarioPorCnpj: Usuario | null = await this.usuarioDao.buscarUsuarioPorCnpj(cnpjEmpresa, transaction);
                if(usuarioPorCnpj){
                    await transaction.rollback();
                    res.status(409).json({mensagem: "CNPJ já cadastrado"});
                    return;
                }
            }

            const usuario: Usuario = await this.usuarioDao.cadastrarUsuario(emailUsu, senhaUsu, nomeUsu, sobrenomeUsu, null, dtNasUsu, telUsu, cpfUsu, nomeEmpresa, null, telEmpresa, cnpjEmpresa, localizacaoEmpresa, transaction);
            
            if(organizador){
                await this.usuarioTipoDao.cadastrarUsuarioTipo(usuario.codigoUsu, 1, transaction);
            }
            if(prestador){
                await this.usuarioTipoDao.cadastrarUsuarioTipo(usuario.codigoUsu, 2, transaction);
            }

            await transaction.commit();
            res.status(201).json({ message: 'Usuario cadastrado com sucesso!' });
        }   
        catch (error: any) {
            await transaction.rollback();
            console.error("Erro ao cadastrar usuario",error);
            res.status(409).json({ error: 'Erro ao cadastrar usuario' });
        }  
    }

    public fazerLogin = async (req: Request, res: Response) => {
        try{
            const { email, senha } = req.body;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(email);
            if(!usuario) {
                res.status(401).json({mensagem: "login inválido"});
                return;
            }
            const senhaValida = await compararSenha(senha, usuario.senhaUsu);
            if(!senhaValida){
                res.status(401).json({mensagem: "senha inválida"});
                return;
            }
        
            const token = jwt.sign(
                {email},
                process.env.JWT_SECRET_LOGIN!,
                {expiresIn: "1h"}
            );
            res.status(200).json({mensagem: "Usuario autenticado com sucesso!", token});
        }
        catch(error){
            console.error('Erro ao autenticar usuario');
            res.status(500).json({mensagem: "Erro ao autenticar usuario"});
        }
    }

    public esqueciSenha = async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        try{
            const { email } = req.body;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(email, transaction);
            if(!usuario) {
                await transaction.rollback();
                res.status(404).json({mensagem: "E-mail não encontrado"});
                return;
            }
            const token = jwt.sign({email}, process.env.JWT_SECRET_RESET_PASSWORD!, {expiresIn: "15m"});
            usuario.tokenRedefinicaoSenha = token;
            usuario.tokenUtilizado = false;
            await this.usuarioDao.atualizarUsuario(usuario, transaction);
            await enviarEmailRecuperacaoSenha(email, usuario.nomeUsu, token);
            await transaction.commit();
            res.status(200).json({mensagem: "Email de recuperação enviado com sucesso!"});
        }
        catch(error){
            await transaction.rollback();
            console.error('Erro ao enviar email');
            res.status(500).json({mensagem: "Erro ao enviar email"});
        }
    }

    public verificarTokenRedefinicaoSenha = async (req: Request, res: Response) => {
        try{
            const { token } = req.body;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorTokenRedefinicaoSenha(token);
            if(!usuario || usuario.tokenUtilizado){
                res.status(401).json({mensagem: "Token inválido"});
                return;
            }
            res.status(200).json({mensagem: "Token válido"});
        }
        catch(error){
            console.error('Erro ao verificar token');
            res.status(500).json({mensagem: "Erro ao verificar token"});
        }
    }

    public redefinirSenha = async (req: Request, res: Response) => {
        try{
            const { token, novaSenha } = req.body;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorTokenRedefinicaoSenha(token);
            if(!usuario || usuario.tokenUtilizado){
                res.status(401).json({mensagem: "Token inválido"});
                return;
            }
            criptografarSenha(novaSenha);
            usuario.senhaUsu = novaSenha;
            usuario.tokenUtilizado = true;
            await this.usuarioDao.atualizarUsuario(usuario);
            res.status(200).json({mensagem: "Senha redefinida com sucesso!"});
        }
        catch(error){
            console.error('Erro ao redefinir senha');
            res.status(500).json({mensagem: "Erro ao redefinir senha"});
        }
    }

    public validarCpf = async (req: Request, res: Response) => {
        try{
            const { cpfUsu } = req.body;
            if(!cpf.isValid(cpfUsu)){
                res.status(400).json({mensagem: "CPF inválido"});
                return;
            }
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorCpf(cpfUsu);
            if(usuario){
                res.status(409).json({mensagem: "CPF já cadastrado"});
                return;
            }
            res.status(200).json({mensagem: "CPF válido"});
        }
        catch(error){
            console.error('Erro ao validar CPF');
            res.status(500).json({mensagem: "Erro ao validar CPF"});
        }
    }

    public validarCnpj = async (req: Request, res: Response) => {
        try{
            const { cnpjEmpresa } = req.body;
            if(!cnpj.isValid(cnpjEmpresa)){
                res.status(400).json({mensagem: "CNPJ inválido"});
                return;
            }
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorCnpj(cnpjEmpresa);
            if(usuario){
                res.status(409).json({mensagem: "CNPJ já cadastrado"});
                return;
            }
            res.status(200).json({mensagem: "CNPJ válido"});
        }
        catch(error){
            console.error('Erro ao validar CNPJ');
            res.status(500).json({mensagem: "Erro ao validar CNPJ"});
        }
    }

    public validarEmail = async (req: Request, res: Response) => {
        try{
            const { emailUsu } = req.body;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(emailUsu);
            if(usuario){
                res.status(409).json({mensagem: "E-mail já cadastrado"});
                return;
            }
            res.status(200).json({mensagem: "E-mail válido"});
        }
        catch(error){
            console.error('Erro ao validar email');
            res.status(500).json({mensagem: "Erro ao validar email"});
        }
    }

    public buscarUsuarioPorEmail = async (req: Request, res: Response) => {
        try{
            const emailUsu = req.params.emailUsu;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(emailUsu);
            if(!usuario){
                res.status(404).json({mensagem: "Usuário não encontrado"});
                return;
            }
            res.status(200).json(usuario);
            return;
        }
        catch(error){
            console.error('Erro ao buscar usuario por email', error);
            res.status(500).json({mensagem: "Erro ao buscar usuário por email"});
        }
    }

    public deletarUsuario = async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        try{
            const emailUsu = req.params.emailUsu;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(emailUsu, transaction);
            if(!usuario){
                res.status(404).json({mensagem: "Usuário não encontrado"});
                return;
            }
            await this.usuarioDao.deletarUsuario(usuario, transaction);
            await transaction.commit();
            res.status(200).json({mensagem: "Usuário deletado com sucesso"});
        }
        catch(error){
            await transaction.rollback();
            console.error('Erro ao deletar usuario', error);
            res.status(500).json({mensagem: "Erro ao deletar usuário"});
        }
    }



    public atualizarUsuario = async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        try{
            let { nomeUsu, sobrenomeUsu, dtNasUsu, telUsu, cpfUsu, nomeEmpresa, telEmpresa, cnpjEmpresa, localizacaoEmpresa  } = req.body;
            const email = req.params.emailUsu;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(email, transaction);
            if(!usuario){
                res.status(404).json({mensagem: "Usuário não encontrado"});
                return;
            }
            for(let atributo in req.body){
                if(req.body[atributo] === ''){
                    req.body[atributo] = null;
                }
            await this.usuarioDao.editarUsuario(email, nomeUsu, sobrenomeUsu, dtNasUsu, telUsu, cpfUsu, nomeEmpresa, telEmpresa, cnpjEmpresa, localizacaoEmpresa, transaction);
            await transaction.commit();
            res.status(200).json({mensagem: "Usuário atualizado com sucesso"});
            return;
            }
        }
        catch(error){
            await transaction.rollback();
            console.error('Erro ao atualizar usuario', error);
            res.status(500).json({mensagem: "Erro ao atualizar usuário"});
        }
    }
}