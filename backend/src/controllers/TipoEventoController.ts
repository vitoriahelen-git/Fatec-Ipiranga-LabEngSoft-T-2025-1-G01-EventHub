import TipoEventoDao from "../dao/TipoEventoDao";
import { Request, Response } from "express";

export default class TipoEventoController {
    private tipoEventoDao = new TipoEventoDao();

    public listarTipoEvento = async (req: Request, res: Response) => {
        try {
            const tipoEventos = await this.tipoEventoDao.listarTipoEvento();
            if (tipoEventos.length === 0) {
                const mensagem = "Nenhum tipo de evento encontrado";
                res.status(404).json({ mensagem });
                return;
            }
            res.status(200).json(tipoEventos);
        } catch (error) {
            console.error('Erro ao listar tipos de evento', error);
            res.status(500).json({ mensagem: "Erro ao listar tipos de evento" });
        }
    }
}