import { Transaction } from "sequelize";
import TipoEvento from "../models/TipoEvento";

export default class TipoEventoDao{
    public listarTipoEvento = async (): Promise<TipoEvento[]> => {
        const tipoEventos: TipoEvento[] = await TipoEvento.findAll();
        return tipoEventos;
    }

    public buscarTipoEventoPorId = async (idTipoEvento: number): Promise<TipoEvento | null> => {
        const tipoEvento: TipoEvento | null = await TipoEvento.findByPk(idTipoEvento);
        return tipoEvento;
    }
}