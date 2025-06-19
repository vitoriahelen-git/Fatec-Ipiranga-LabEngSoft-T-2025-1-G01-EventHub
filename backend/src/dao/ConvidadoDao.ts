import Convite from '../models/Convite';
import Convidado from '../models/Convidado';
import { Transaction } from 'sequelize';

export default class ConvidadoDao {
  public criarConvidado = async (idConvite: string, nome: string, email: string, rg: string, dataNascimento: Date, transaction: Transaction | null = null) => {
    const convidado = await Convidado.create({
      nome,
      email,
      rg,
      dataNascimento,
      status: "Pendente",
      idConvite
    }, { transaction });
    return convidado;
  };

  public listarConvidados = async (idEvento: string) => {
    const convidados = await Convidado.findAll({
      include: [
        {
          model: Convite,
          as: 'convite',
          where: {
            idEvento
          }
        },
        {
          model: Convidado,
          as: 'acompanhantes',
          through: {
            attributes: ['relacionamento'],
          },
          attributes: ['idConvidado', 'nome', 'email', 'rg', 'dataNascimento', 'status'],
        }
      ],
    });

    const idsAcompanhantes: string[] = [];

    for(const convidado of convidados) {
      for(const acompanhante of convidado.acompanhantes || []) {
        idsAcompanhantes.push(acompanhante.idConvidado);
      }
    }

    const convidadosPrincipais = convidados.filter((convidado) => !idsAcompanhantes.includes(convidado.idConvidado));

    return convidadosPrincipais.map((convidado) => ({
      idConvidado: convidado.idConvidado,
      nome: convidado.nome,
      email: convidado.email,
      rg: convidado.rg,
      dataNascimento: convidado.dataNascimento,
      status: convidado.status,
      idConvite: convidado.idConvite,
      acompanhantes: convidado.acompanhantes?.map((acompanhante: Convidado) => ({
        idConvidado: acompanhante.idConvidado,
        nome: acompanhante.nome,
        email: acompanhante.email,
        rg: acompanhante.rg,
        dataNascimento: acompanhante.dataNascimento,
        status: acompanhante.status,
        relacionamento: (acompanhante as any).Acompanhante.relacionamento
      })) || []
    }));
  };

  public buscarConvidadoPorConvite = async (idConvite: string) => {
    const convidados = await Convidado.findAll({
      include: [
        {
          model: Convite,
          as: 'convite',
          where: {
            idConvite
          }
        },
        {
          model: Convidado,
          as: 'acompanhantes',
          through: {
            attributes: ['relacionamento'],
          },
          attributes: ['idConvidado', 'nome', 'email', 'rg', 'dataNascimento', 'status'],
        }
      ],
    });

    const idsAcompanhantes: string[] = [];

    for(const convidado of convidados) {
      for(const acompanhante of convidado.acompanhantes || []) {
        idsAcompanhantes.push(acompanhante.idConvidado);
      }
    }

    const convidadoPrincipal = convidados.find((convidado) => !idsAcompanhantes.includes(convidado.idConvidado));

    return convidadoPrincipal || null;
  }

  public atualizarStatusConvidadoDAO = async (idConvidado: string, status: string) => {
    try {
      const convidado = await Convidado.findByPk(idConvidado, {
        include: [{
          association: 'acompanhantes',
          through: {attributes: []}
        }]
      });
      if (!convidado) {
        throw new Error('Convidado não encontrado');
      }
      convidado.status = status;
      await convidado.save();

      if(convidado.acompanhantes?.length) {
        const idsAcompanhantes = convidado.acompanhantes.map(a => a.idConvidado);
        await Convidado.update({ status }, { where: { idConvidado: idsAcompanhantes } });
      }

      return convidado;
    } catch (error) {
      console.error('Erro ao atualizar status do convidado:', error);
      throw error;
    }
  }
}