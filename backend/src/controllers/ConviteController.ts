import { Request, Response } from 'express';
import ConviteDao from "../dao/ConviteDao";;



export default class ConvidadoController {

  private conviteDao = new ConviteDao();
  
  
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

      if (!idEvento) {
        return res.status(400).json({ mensagem: 'ID do evento é obrigatório.' });
      }

      const convite = await this.conviteDao.gerarConvite(Number(idEvento));
      return res.status(201).json({ linkConvite: convite.linkConvite });

    } catch (error) {
      console.error('Erro ao gerar convite:', error);
      return res.status(500).json({ mensagem: 'Erro ao gerar convite.' });
    }
  };

  public deletarConvite = async (req: Request, res: Response) => {
    const { idConvite } = req.params; // Recebe o id do convite por parâmetro
  
    try {
      const resultado = await this.conviteDao.deletarConvite(idConvite);
      if (resultado) {
        return res.status(200).json({ message: "Convite deletado com sucesso" });
      }
      return res.status(404).json({ message: "Convite não encontrado" });
    } catch (error) {
      console.error("Erro ao deletar convite:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  public confirmarConvite = async (req: Request, res: Response) => {
    try {
      const { idConvite } = req.params;
      const { nome, email, rg, dataNascimento } = req.body;
  
      const convidado = await this.conviteDao.confirmarConvite(
        idConvite,
        nome,
        email,
        rg,
        new Date(dataNascimento)
      );
  
      res.status(201).json(convidado);
    } catch (error) {
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
}
