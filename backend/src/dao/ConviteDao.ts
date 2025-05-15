import Convite from '../models/Convite';
import Convidado from '../models/Convidado';
import { v4 as uuidv4 } from 'uuid';
import Evento from '../models/Evento';

export default class ConviteDao {
  public listarConvite = async (idEvento: string) => {
    const convites = await Convite.findAll({
      where: {
        idEvento
        },
    });
    console.log("convites", convites);
    return convites;
  }

  public async gerarConvite(idEvento: number): Promise<Convite> {
    const uuidConvite = uuidv4();
    const link = `http://localhost:5173/confirmar-presenca/${uuidConvite}`;
    const dataConvite = new Date();

    const novoConvite = await Convite.create({
      idConvite: uuidConvite,
      idEvento,
      idConvidado: null,
      linkConvite: link,
      dataConvite,
      status: 'Pendente'
    });

    return novoConvite;
  }

  public async deletarConvite(idConvite: string): Promise<boolean> {
    try {
      const convite = await Convite.destroy({
        where: { idConvite: idConvite }
      });
  
      if (!convite) {
        throw new Error("Convite não encontrado");
      }
      return true;
    } catch (error) {
      console.error("Erro ao deletar convite:", error);
      throw error;
    }
  };

  public async confirmarConvite (
    idConvite: string,
    nome: string,
    email: string,
    rg: string,
    dataNascimento: Date
  ): Promise<Convidado> {
    const convite = await Convite.findByPk(idConvite);
    console.log('idConvite',idConvite)
  
    if (!convite) {
      throw new Error("Convite não encontrado.");
    }
  
    if (convite.status === "Utilizado") {
      throw new Error("Convite já foi utilizado.");
    }
  
    const novoConvidado = await Convidado.create({
      nome,
      email,
      rg,
      dataNascimento,
      status: "Pendente",
      idConvite,
    });
  
    // Atualiza o status do convite
    await convite.update({
        idConvidado: novoConvidado.idConvidado, 
        status: "Utilizado", 
  });
    return novoConvidado;
  };

  public async buscarEventoPorConvite(idConvite: string): Promise<Evento> {
    const convite = await Convite.findByPk(idConvite);
    if (!convite) {
      throw new Error('Convite não encontrado');
    }
  
    const idEvento = convite.idEvento;
  

    const evento = await Evento.findOne({
      where: { idEvento },
      attributes: [
        'idEvento', 'nomeEvento', 'descricaoEvento', 'imagemEvento', 'dataEvento', 'horaInicio', 'horaFim',   
        'cepLocal', 'enderecoLocal', 'numeroLocal', 'complementoLocal',
        'bairroLocal', 'cidadeLocal', 'ufLocal'
      ]
    });
  
    if (!evento) {
      throw new Error('Evento não encontrado');
    }
  
    return evento;
  };
}


