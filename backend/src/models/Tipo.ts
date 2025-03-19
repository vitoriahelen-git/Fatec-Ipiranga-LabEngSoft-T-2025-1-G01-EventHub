import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Tipo extends Model{
    declare idTipo: number;
    declare nomeTipo: string;
    declare descricaoTipo: string;
}

Tipo.init(
    {   
        idTipo:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        nomeTipo:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        descricaoTipo:{
            type:DataTypes.STRING,
            allowNull: false
        }
    },{
        sequelize,
        modelName:'Tipo',
        tableName:'TIPO',
        timestamps: false,
        underscored: true
    }
);

export default Tipo;