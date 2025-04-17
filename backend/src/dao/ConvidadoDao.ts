import Convite from '../models/Convite';
import Convidado from '../models/Convidado';

export default class ConvidadoDao {
  public listarConvidados = async (idEvento: string) => {
        const convidados = await Convidado.findAll({
            include: [{
                model: Convite,
                as: 'Convite',
                where: {
                  idEvento
                }
              }],
        });
    console.log("convidados", convidados);
    return convidados;
  };

  public atualizarStatusConvidadoDAO = async (idConvidado: string, status: string) => {
    try {
      const convidado = await Convidado.findByPk(idConvidado);
      if (!convidado) {
        throw new Error('Convidado não encontrado');
      }
      convidado.status = status;
      await convidado.save();
      return convidado;
    } catch (error) {
      console.error('Erro ao atualizar status do convidado:', error);
      throw error;
    }
  }
}