import { Transaction } from "sequelize";
import Evento from "../models/Evento";
import Usuario from "../models/Usuario";

export default class EventoDao{
    public cadastrarEvento = async (descricaoEvento:String, imagemEvento:String|null, cepLocal:String, enderecoLocal:String, numeroLocal:String, complementoLocal:String, bairroLocal:String, cidadeLocal:String, ufLocal:String,horaInicio:Date,horaFim:Date,nomeEvento:string,dataEvento:Date,idTipoEvento:number,idUsuario:string, transaction: Transaction | null = null)=>{
       const evento: Evento = await Evento.create({
            descricaoEvento,
            imagemEvento,
            cepLocal, 
            enderecoLocal, 
            numeroLocal, 
            complementoLocal, 
            bairroLocal, 
            cidadeLocal, 
            ufLocal,
            horaInicio,
            horaFim,
            nomeEvento,
            dataEvento,
            idTipoEvento,
            idUsuario
        }, transaction ? {transaction} : {});
        return evento;
    }

    public listarEventos = async (emailUsu: string):Promise<Evento[]> =>{
        const usuario: Usuario | null = await Usuario.findOne({
            where: {
                emailUsu
            }
        });
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        const idUsuario = usuario?.codigoUsu;

        const eventos: Evento[] = await Evento.findAll({
            where: {
                idUsuario
            }
        });
        return eventos;
    }

    public buscarEventoporId = async (idEvento: string):Promise<Evento | null> =>{
        const evento: Evento | null = await Evento.findByPk(idEvento);
        return evento;
    }

    public editarEvento = async (  id: number,
        dadosAtualizados: {
            nomeEvento: string,
            descricaoEvento: string,
            idTipoEvento : string,
            dataEvento: string,
            horaInicio: string,
            horaFim: string,
            cepLocal: string,
            enderecoLocal: string,
            numeroLocal: string,
            complementoLocal: string,
            bairroLocal: string,
            cidadeLocal: string,
            ufLocal: string,
            imagemEvento: string | null,
            imagemEditada: boolean
        }
      ) => {
        const evento = await Evento.findByPk(id);
        
      
        if (!evento) {
          return null;
        }

        const { imagemEditada } = dadosAtualizados;
      
        await evento.update({
          nomeEvento: dadosAtualizados.nomeEvento,
          descricaoEvento: dadosAtualizados.descricaoEvento,
          idTipoEvento: dadosAtualizados.idTipoEvento,
          dataEvento: dadosAtualizados.dataEvento,
          horaInicio: dadosAtualizados.horaInicio,
          horaFim: dadosAtualizados.horaFim,
          cepLocal: dadosAtualizados.cepLocal,
          enderecoLocal: dadosAtualizados.enderecoLocal,
          numeroLocal: dadosAtualizados.numeroLocal,
          complementoLocal: dadosAtualizados.complementoLocal,
          bairroLocal: dadosAtualizados.bairroLocal,
          cidadeLocal: dadosAtualizados.cidadeLocal,
          ufLocal: dadosAtualizados.ufLocal,
          ...(imagemEditada && { imagemEvento: dadosAtualizados.imagemEvento })
        });
      
        return evento;
    }


    public deletarEvento = async (idEvento: string) => {
        await Evento.destroy({
            where: {
                idEvento
            }
        });
    }
}

