import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class TipoEvento extends Model{
    declare idTipoEvento: number;
    declare descricaoTipoEvento: string;
}

TipoEvento.init(
    {
        idTipoEvento:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        descricaoTipoEvento:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        sequelize,
        modelName:'TipoEvento',
        tableName:'TIPO_EVENTO',
        timestamps:false,
        underscored:true
    }
);

export default TipoEvento;