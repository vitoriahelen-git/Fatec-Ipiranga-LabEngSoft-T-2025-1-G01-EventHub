import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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

export default validarTokenRedefinicaoSenha;