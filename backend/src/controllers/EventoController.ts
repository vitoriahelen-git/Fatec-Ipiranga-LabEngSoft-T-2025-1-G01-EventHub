import { Request, Response } from "express";
import EventoDao from "../dao/EventoDao";
import fs from "fs";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { deletarImagemServidor } from "../utils/deletarImagemServidor";
import TipoEventoDao from "../dao/TipoEventoDao";

export default class EventoController {

    private eventoDao = new EventoDao();
    private tipoEventoDao = new TipoEventoDao();

    public cadastrarEvento = async (req: Request, res: Response) =>{
        try{
            const { descricaoEvento,  cepLocal, enderecoLocal, numeroLocal, complementoLocal, bairroLocal, cidadeLocal, ufLocal, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento } = req.body;
            const  idUsuario = req.params.idUsuario;
            const imagemEvento = req.file?.filename || null;
            await this.eventoDao.cadastrarEvento(descricaoEvento, imagemEvento, cepLocal, enderecoLocal, numeroLocal, complementoLocal, bairroLocal, cidadeLocal, ufLocal, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario)
            res.status(201).json({ message: 'Evento cadastrado com sucesso!'});
        }
        catch(error){
            console.error('Erro ao cadastrar evento', error);
            if(req.file){
            fs.unlink('uploads/' + req.file.filename,(err)=>{
                if(err){
                    console.error('Erro ao deletar imagem', err)
                    return
                }
                console.log('Imagem deletada com sucesso')
            })
        }
        res.status(500).json({mensagem: "Erro ao cadastrar evento"});
        }
    }

    public listarEventos = async (req: AuthenticatedRequest, res: Response) =>{
        try{
            const emailUsu = req.user!.email;
            const eventos = await this.eventoDao.listarEventos( emailUsu );
            if (eventos.length === 0){
                const mensagem = "Nenhum evento encontrado";
                res.status(404).json({mensagem});
                return;
            }
            res.status(200).json(eventos);
        }
        catch(error){
            console.error('Erro ao listar eventos', error);
            res.status(500).json({mensagem: "Erro ao listar eventos"});
        }
    }

    public buscarEventoporId = async (req: Request, res: Response) =>{
        try{
            const { idEvento } = req.params;
            const evento = await this.eventoDao.buscarEventoporId(idEvento);
            if (!evento){
                const mensagem = "Evento não encontrado";
                res.status(404).json({mensagem});
                return;
            }
            const tipoEvento = await this.tipoEventoDao.buscarTipoEventoPorId(evento.dataValues.idTipoEvento);
            res.status(200).json({...evento.dataValues, tipoEvento: tipoEvento?.dataValues});
        }
        catch(error){
            console.error('Erro ao buscar evento', error);
            res.status(500).json({mensagem: "Erro ao buscar evento"});
        }
    }

    public editarEvento = async (req: Request, res: Response) =>{
        const { idEvento } = req.params;


        const {
            nomeEvento,
            descricaoEvento,
            idTipoEvento,
            dataEvento,
            horaInicio,
            horaFim,
            cepLocal,
            enderecoLocal,
            numeroLocal,
            complementoLocal,
            bairroLocal,
            cidadeLocal,
            ufLocal,
            imagemEditada,
        } = req.body;

        let imagemEvento = req.file?.filename || null


        
      
        try {
          const eventoAtualizado = await this.eventoDao.editarEvento(Number(idEvento), {
            nomeEvento,
            descricaoEvento,
            idTipoEvento,
            dataEvento,
            horaInicio,
            horaFim,
            cepLocal,
            enderecoLocal,
            numeroLocal,
            complementoLocal,
            bairroLocal,
            cidadeLocal,
            ufLocal,
            imagemEvento,
            imagemEditada: imagemEditada === 'true' ? true : false,
          });

      
          if (!eventoAtualizado) {
            return res.status(404).json({ message: 'Evento não encontrado' });
          }
      
          return res.status(200).json({
            message: 'Evento atualizado com sucesso',
            evento: eventoAtualizado,
          });
        } catch (error) {
          console.error('Erro ao editar evento:', error);
          return res.status(500).json({ message: 'Erro interno ao editar evento' });
        }
      };
    

    public deletarEvento = async (req: Request, res: Response) => {
        try{
            const { idEvento } = req.params; 
            const evento = await this.eventoDao.buscarEventoporId(idEvento)
            if (!evento){
                const mensagem = "Evento não encontrado";
                res.status(404).json({mensagem});
                return;
            }
            else{
                if(evento.dataValues.imagemEvento)
                deletarImagemServidor(evento.dataValues.imagemEvento)
            }
            await this.eventoDao.deletarEvento(idEvento)
            res.status(200).json({mensagem: "Evento deletado com sucesso"});
        }
        catch (error) {
            console.error('Erro ao deletar evento', error);
            res.status(500).json({ mensagem: "Erro ao deletar evento" });
        }
    }

    public atualizarQtdMaxAcompanhantes = async (req: Request, res: Response) => {
        try {
            const { idEvento } = req.params;
            const { qtdMaxAcompanhantes } = req.body;
            const evento = await this.eventoDao.buscarEventoporId(idEvento);
            if (!evento) {
                return res.status(404).json({ message: 'Evento não encontrado' });
            }
            if (qtdMaxAcompanhantes < 0 || qtdMaxAcompanhantes > 99) {
                return res.status(400).json({ message: 'A quantidade máxima de acompanhantes deve ser entre 0 a 99' });
            }
            const eventoAtualizado = await this.eventoDao.atualizarQtdMaxAcompanhantes(idEvento, qtdMaxAcompanhantes);
            return res.status(200).json({ mensagem: 'Quantidade máxima de acompanhantes atualizada com sucesso', evento: eventoAtualizado });

        } catch (error) {
            console.error('Erro ao atualizar quantidade máxima de acompanhantes:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar quantidade máxima de acompanhantes' });
        }
    }
}