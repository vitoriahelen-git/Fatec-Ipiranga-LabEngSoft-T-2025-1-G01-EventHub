import TipoServicoDao from '../dao/TipoServicoDao';
import { Request, Response } from "express";



export default class TipoServicoController{
    private tipoServicoDao = new TipoServicoDao()

    public listarTiposServico = async (req:Request,res:Response)=>{
        try{
            const tiposServico = await this.tipoServicoDao.listarTiposServico()
            if(tiposServico.length === 0){
                const mensagem = "Nenhum tipo de serviço encontrado";
                res.status(404).json({ mensagem });
                return;
            }
            res.status(200).json(tiposServico);
        }
        catch(error){
            console.log('ocorreu algum erro ao buscar os tipos de Serviços: ',error)
            res.status(500).json({ mensagem: "Erro ao listar tipos de Serviço" });
        }
    }
}