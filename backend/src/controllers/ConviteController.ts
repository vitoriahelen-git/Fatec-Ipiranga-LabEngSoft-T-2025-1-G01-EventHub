import { Request, Response } from 'express';
import ConviteDao from "../dao/ConviteDao";
import { sequelize } from '../config/database';
import { Transaction } from 'sequelize';
import AcompanhanteDao from '../dao/AcompanhanteDao';
import ConvidadoDao from '../dao/ConvidadoDao';
import EventoDao from '../dao/EventoDao';

export default class ConviteController {

  private conviteDao = new ConviteDao();
  private convidadoDao = new ConvidadoDao();
  private acompanhanteDao = new AcompanhanteDao();
  private eventoDao = new EventoDao();
  
  public obterConvite = async (req: Request, res: Response) => {
    try {
      const { idEvento } = req.params;
      const convite = await this.conviteDao.listarConvite(idEvento);
      if (convite.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhum convite encontrado.' });
      }
      res.status(200).json(convite);
    } catch (error) {
      console.error('Erro ao obter convite:', error);
      res.status(500).json({ mensagem: 'Erro interno ao obter convite.' });
    }
  };

  public gerarConvite = async (req: Request, res: Response) => {
    try {
      const { idEvento } = req.params;
      const { qtdMaxAcompanhantes, qtdMaxAcompanhantesEvento } = req.body;

      if (!idEvento) {
        return res.status(400).json({ mensagem: 'ID do evento é obrigatório.' });
      }

      if (Number(qtdMaxAcompanhantes) < 0 || Number(qtdMaxAcompanhantes) > 99) {
        return res.status(400).json({ message: 'A quantidade máxima de acompanhantes deve ser entre 0 a 99' });
      }

      if(qtdMaxAcompanhantesEvento){
        const evento = await this.eventoDao.buscarEventoporId(idEvento);
        if (!evento) {
          return res.status(404).json({ mensagem: 'Evento não encontrado.' });
        }
        await this.eventoDao.atualizarQtdMaxAcompanhantes(idEvento, qtdMaxAcompanhantes);
      }

      const convite = await this.conviteDao.gerarConvite(Number(idEvento), Number(qtdMaxAcompanhantes));
      return res.status(201).json({ convite });

    } catch (error) {
      console.error('Erro ao gerar convite:', error);
      return res.status(500).json({ mensagem: 'Erro ao gerar convite.' });
    }
  };

  public deletarConvite = async (req: Request, res: Response) => {
    const { idConvite } = req.params; 
  
    try {
      const convite = await this.conviteDao.verificarConvite(idConvite);
      if (!convite) {
        return res.status(404).json({ message: "Convite não encontrado" });
      }
      if( convite.status === "Utilizado") {
        return res.status(400).json({ message: "Convite já foi utilizado e não pode ser deletado" });
      }
      await this.conviteDao.deletarConvite(idConvite);
      return res.status(200).json({ message: "Convite deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar convite:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  public confirmarConvite = async (req: Request, res: Response) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { idConvite } = req.params;
      const { nome, email, rg, dataNascimento } = req.body;
      const acompanhantes: any[] = req.body.acompanhantes || [];

      const convite = await this.conviteDao.verificarConvite(idConvite);
      if (!convite) {
        await transaction.rollback();
        res.status(404).json({ mensagem: 'Convite não encontrado.' });
        return;
      }

      if(acompanhantes.length > convite.qtdMaxAcompanhantes) {
        await transaction.rollback();
        res.status(400).json({ mensagem: `O convite permite no máximo ${convite.qtdMaxAcompanhantes} acompanhante(s).` });
        return;
      }
      
      const convidado = await this.convidadoDao.criarConvidado(
        idConvite,
        nome,
        email,
        rg,
        dataNascimento,
        transaction
      );

      const acompanhantesSalvos: any[] = [];

      for (const acompanhante of acompanhantes) {
        const acompanhanteSalvo = await this.convidadoDao.criarConvidado(
          idConvite,
          acompanhante.nome,
          acompanhante.email,
          acompanhante.rg,
          acompanhante.dataNascimento,
          transaction
        );

        acompanhantesSalvos.push({...acompanhanteSalvo.dataValues, relacionamento: acompanhante.relacionamento});

        await this.acompanhanteDao.criarAcompanhante(
          convidado.idConvidado,
          acompanhanteSalvo.idConvidado,
          acompanhante.relacionamento,
          transaction
        );
      }

      await this.conviteDao.confirmarConvite(idConvite, transaction);
      await transaction.commit();
      res.status(201).json({convidado, acompanhantes: acompanhantesSalvos});
    } 
    catch (error) {
      await transaction.rollback();
      console.error("Erro ao confirmar convite:", error);
      res.status(400).json({ error: (error as Error).message });
    }
  };
  
  public buscarEventoPorConvite = async (req: Request, res: Response) => {
    try {
      const { idConvite } = req.params;
      const evento = await this.conviteDao.buscarEventoPorConvite(idConvite);
      res.json(evento);
    } catch (err: any) {
      res.status(404).json({ erro: err.message });
    }
  };

  public verificarConvite = async (req: Request, res: Response) => {
    try {
      const { idConvite } = req.params;
      const convite = await this.conviteDao.verificarConvite(idConvite);
      res.json(convite);
    } catch (err: any) {
      res.status(404).json({ erro: err.message });
    }
  }
}
