import Convite from '../models/Convite';
import { v4 as uuidv4 } from 'uuid';
import Evento from '../models/Evento';
import { Transaction } from 'sequelize';

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

  public async gerarConvite(idEvento: number, qtdMaxAcompanhantes: number): Promise<Convite> {
    const uuidConvite = uuidv4();
    const dataConvite = new Date();

    const novoConvite = await Convite.create({
      idConvite: uuidConvite,
      idEvento,
      dataConvite,
      status: 'Pendente',
      qtdMaxAcompanhantes
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

  public async confirmarConvite(idConvite: string, transaction: Transaction | null = null): Promise<Convite> {
    const convite = await Convite.findByPk(idConvite);

    if (!convite) {
      throw new Error("Convite não encontrado.");
    }

    if (convite.status === "Utilizado") {
      throw new Error("Convite já foi utilizado.");
    }

    await convite.update({
        status: "Utilizado",
      }, { transaction }
    );

    return convite;
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
        'bairroLocal', 'cidadeLocal', 'ufLocal', 'qtdMaxAcompanhantes'
      ]
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    return evento;
  };

  public async verificarConvite(idConvite: string): Promise<Convite | null> {
    const convite = await Convite.findOne({
      where: { idConvite }
    });

    if (!convite) {
      throw new Error('Convite não encontrado');
    }

    return convite;
  }
}


