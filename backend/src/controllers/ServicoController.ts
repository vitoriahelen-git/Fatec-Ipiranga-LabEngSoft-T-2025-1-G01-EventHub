import { Request, Response } from "express";
import ServicoDao from '../dao/ServicoDao';
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import TipoServicoDao from "../dao/TipoServicoDao";
import { deletarImagemServidor } from "../utils/deletarImagemServidor";

export default class ServicoController{
    private servicoDao = new ServicoDao()
    private tipoServicoDao = new TipoServicoDao()

    public cadastrarServico = async (req:AuthenticatedRequest, res:Response)=>{
        try{
            const {nomeServico, idTipoServico, descricaoServico, valorServico, unidadeCobranca, qntMinima, qntMaxima} = req.body
            const idUsuario = req.user!.id.toString()
            const imagens = req.files as Express.Multer.File[]
            const imagem1 = imagens[0].filename
            const imagem2 = imagens[1] ? imagens[1].filename : null
            const imagem3 = imagens[2] ? imagens[2].filename : null
            const imagem4 = imagens[3] ? imagens[3].filename : null
            const imagem5 = imagens[4] ? imagens[4].filename : null
            const imagem6 = imagens[5] ? imagens[5].filename : null
            await this.servicoDao.cadastrarServico(idUsuario, idTipoServico, nomeServico, descricaoServico, unidadeCobranca, valorServico, qntMinima, qntMaxima, imagem1, imagem2, imagem3, imagem4, imagem5, imagem6)
            res.status(201).json({ message: 'Serviço cadastrado com sucesso!'});
        }
        catch(error){
            console.log('ocoreu um erro durante o cadastro de serviço:',error)
        }
    }

    public obterServico = async (req: Request, res: Response) =>{
        try{
            const { idServico } = req.params;
            const servico = await this.servicoDao.buscarServicoPorId(idServico);
            if (!servico){
                res.status(404).json({mensagem: "Serviço não encontrado"});
                return;
            }
            const tipoServico = await this.tipoServicoDao.buscarTipoServicoPorId(servico.dataValues.idTipoServico);
            res.status(200).json({...servico.dataValues, tipoServico: tipoServico?.dataValues});
        }
        catch(error){
            console.error('Erro ao buscar serviço', error);
            res.status(500).json({mensagem: "Erro ao buscar serviço"});
        }
    }
    
    public listarServicos = async (req: AuthenticatedRequest, res: Response) =>{
        try{
            const emailUsu = req.user!.email;
            const servicos = await this.servicoDao.listarServicos( emailUsu );
            if (servicos.length === 0){
                const mensagem = "Nenhum servico encontrado";
                res.status(404).json({mensagem});
                return;
            }
            res.status(200).json(servicos);
        }
        catch(error){
            console.error('Erro ao listar servicos', error);
            res.status(500).json({mensagem: "Erro ao listar servicos"});
        }
    }

    public editarServico = async (req: Request, res: Response) =>{
        const { idServico } = req.params;


        const {
            nomeServico,
            descricaoServico,
            idTipoServico,
            unidadeCobranca,
            valorServico,
            qntMinima,
            qntMaxima,
        } = req.body;

        let imagensServico = req.file?.filename || null


        
      
        try {
          const servicoAtualizado = await this.servicoDao.editarServico(Number(idServico), {
            nomeServico,
            descricaoServico,
            idTipoServico,
            unidadeCobranca,
            valorServico,
            qntMinima,
            qntMaxima,
          });

      
          if (!servicoAtualizado) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
          }
      
          return res.status(200).json({
            message: 'Serviço atualizado com sucesso',
            servico: servicoAtualizado,
          });
        } catch (error) {
          console.error('Erro ao editar servico:', error);
          return res.status(500).json({ message: 'Erro interno ao editar servico' });
        }
      };

        public deletarServico = async (req: Request, res: Response) => {
            try{
                const { idServico } = req.params; 
                const servico = await this.servicoDao.buscarServicoPorId(idServico)
                if (!servico){
                    const mensagem = "Serviço não encontrado";
                    res.status(404).json({mensagem});
                    return;
                }
                else{
                    // if(servico.dataValues.imagemServico)
                    // deletarImagemServidor(servico.dataValues.imagemServico)
                }
                await this.servicoDao.deletarServico(idServico)
                res.status(200).json({mensagem: "Serviço deletado com sucesso"});
            }
            catch (error) {
                console.error('Erro ao deletar Serviço', error);
                res.status(500).json({ mensagem: "Erro ao deletar Serviço" });
            }
        }
}