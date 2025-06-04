import { Transaction } from "sequelize";
import Acompanhante from "../models/Acompanhante";

export default class AcompanhanteDao{
    public async criarAcompanhante(idConvidado: string, idAcompanhante: string, relacionamento: string, transaction: Transaction | null = null): Promise<Acompanhante> {
        const novoAcompanhante = await Acompanhante.create({
            idConvidado,
            idAcompanhante,
            relacionamento
        }, {transaction});
        return novoAcompanhante;
    }
}