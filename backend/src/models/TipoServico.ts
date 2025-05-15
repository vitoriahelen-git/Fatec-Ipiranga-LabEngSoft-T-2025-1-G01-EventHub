import { DataTypes,Model } from "sequelize";
import { sequelize } from "../config/database";

class TipoServico extends Model{
    declare idTipoServico: number;
    declare descricaoTipoServico: String;
}

TipoServico.init(
    {
        idTipoServico:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        descricaoTipoServico:{
            type:DataTypes.STRING(30),
            allowNull:false
        }
    },{
        sequelize,
        modelName:'TipoServico',
        tableName:'TIPO_SERVICO',
        timestamps:false,
        underscored:true
    }
);

export default TipoServico;