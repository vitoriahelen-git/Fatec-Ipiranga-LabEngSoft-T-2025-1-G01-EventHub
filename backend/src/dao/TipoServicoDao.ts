import { Transaction } from "sequelize";
import TipoServico from '../models/TipoServico';

export default class TipoServicoDao{
    public listarTiposServico = async ():Promise<TipoServico[]>=>{
        const tipoServico: TipoServico[] = await TipoServico.findAll()
        return tipoServico
    }

    public buscarTipoServicoPorId = async (idTipoServico: number): Promise<TipoServico | null> => {
        const tipoServico: TipoServico | null = await TipoServico.findByPk(idTipoServico);
        return tipoServico;
    }
}