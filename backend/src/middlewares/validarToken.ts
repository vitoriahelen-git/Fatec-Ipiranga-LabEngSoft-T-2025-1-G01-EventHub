import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const validarTokenAutenticacao = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if(!authorization){
        res.status(401).json({mensagem: "Token não informado"});
        return;
    }
    const token = authorization.split(' ')[1];
    try{
        jwt.verify(token, process.env.JWT_SECRET_LOGIN!, (erro: any, decoded: any) => {
            if(erro){
                res.status(401).json({mensagem: "Token inválido ou expirado"});
                return;
            }
            req.user = {
                id: decoded.id,
                email: decoded.email,
                tipo: decoded.tipo
            }
            next();
        });
    }
    catch(e){
        console.error('Erro ao validar token');
        res.status(500).json({mensagem: "Erro ao validar token"});
    }
}

const validarTokenRedefinicaoSenha = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { token } = req.body;
        if(!token){
            res.status(400).json({mensagem: "Token não informado"});
            return;
        }
        jwt.verify(token, process.env.JWT_SECRET_RESET_PASSWORD!, (erro: any, decoded: any) => {
            if(erro){
                res.status(401).json({mensagem: "Token inválido ou expirado"});
                return;
            }
            next();
        });
    }
    catch(error: any){
        console.error('Erro ao validar token');
        res.status(500).json({mensagem: "Erro ao validar token"});
    }
}

export {
    validarTokenAutenticacao,
    validarTokenRedefinicaoSenha
};