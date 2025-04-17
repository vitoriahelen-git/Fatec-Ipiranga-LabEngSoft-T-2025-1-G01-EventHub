import { Request, Response } from 'express';
import ConvidadoDao from "../dao/ConvidadoDao";;



export default class ConvidadoController {

  private convidadoDao = new ConvidadoDao();
  
  
  public obterConvidados = async (req: Request, res: Response) => {
    try {
      const { idEvento } = req.params;
      const convidados = await this.convidadoDao.listarConvidados(idEvento);
      if (convidados.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhum convidado encontrado.' });
      }
      res.status(200).json(convidados);
    } catch (error) {
      console.error('Erro ao obter convidados:', error);
      res.status(500).json({ mensagem: 'Erro interno ao obter convidados.' });
    }
  };

  public atualizarStatusConvidadoController = async (req: Request, res: Response) => {
    const { idConvidado } = req.params;
    const { status } = req.body; 
  
    try {
      await this.convidadoDao.atualizarStatusConvidadoDAO(idConvidado, status);
      res.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      console.error('Erro no controller ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  };
}
