import { Transaction } from "sequelize";
import UsuarioTipo from "../models/UsuarioTipo";

export default class UsuarioTipoDao{
    public async cadastrarUsuarioTipo(idUsu: string, idTipo: number, transaction: Transaction | null = null){
        const usuarioTipo: UsuarioTipo = await UsuarioTipo.create({
            idUsu,
            idTipo
        }, transaction ? {transaction} : {});
        return usuarioTipo;
    }
}