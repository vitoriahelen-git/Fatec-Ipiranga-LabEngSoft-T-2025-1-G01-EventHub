import { Request, Response } from "express";
import EventoDao from "../dao/EventoDao";

export default class EventoController {

    private eventoDao = new EventoDao();

    public cadastrarEvento = async (req: Request, res: Response) =>{
        try{
            const { localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario } = req.body;
            await this.eventoDao.cadastrarEvento(localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario)
            res.status(201).json({ message: 'Evento cadastrado com sucesso!'});
        }
        catch(error){
            console.error('Erro ao cadastrar evento', error);
            res.status(500).json({mensagem: "Erro ao cadastrar evento"});
        }
    }

    public listarEventos = async (req: Request, res: Response) =>{
        try{
            const { idUsuario } = req.params;
            const eventos = await this.eventoDao.listarEventos(idUsuario);
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
            res.status(200).json(evento);
        }
        catch(error){
            console.error('Erro ao buscar evento', error);
            res.status(500).json({mensagem: "Erro ao buscar evento"});
        }
    }

    public editarEvento = async (req: Request, res: Response) =>{
        try{
            const { idEvento } = req.params;
            const { localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario } = req.body; 
            const resultado = await this.eventoDao.editarEvento(idEvento, localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario);
            if (resultado[0] === 0){
                const mensagem = "Evento não encontrado";
                res.status(404).json({mensagem});
                return;
            }
            res.status(200).json({mensagem: "Evento editado com sucesso"});
        }
        catch(error){
            console.error('Erro ao editar evento', error);
            res.status(500).json({mensagem: "Erro ao editar evento"});
        }
    }
    

    public deletarEvento = async (req: Request, res: Response) => {
        try{
            const { idEvento } = req.params; 
        
            await this.eventoDao.deletarEvento(idEvento)
            res.status(200).json({mensagem: "Evento deletado com sucesso"});
        }
        catch (error) {
            console.error('Erro ao deletar evento', error);
            res.status(500).json({ mensagem: "Erro ao deletar evento" });
        }
    }
}