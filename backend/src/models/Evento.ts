import { DataTypes,Model } from "sequelize";
import { sequelize } from "../config/database";
import TipoEvento from "./TipoEvento";
import Usuario from "./Usuario";

class Evento extends Model{
    declare idEvento: number;
    declare numeroConvidados: number;
    declare localEvento: string;
    declare horaInicio: Date;
    declare horaFim: Date;
    declare nomeEvento: string;
    declare dataEvento: Date;
    declare idTipo: number;
    declare idUsuario: string;
}

Evento.init(
    {
        idEvento:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        numeroConvidados:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 0
        },
        localEvento:{
            type:DataTypes.STRING,
            allowNull:false
        },
        horaInicio:{
            type:DataTypes.TIME,
            allowNull:false
        },
        horaFim:{
            type:DataTypes.TIME,
            allowNull:false
        },
        nomeEvento:{
            type:DataTypes.STRING,
            allowNull:false
        },
        dataEvento:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },
        idTipoEvento:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:TipoEvento,
                key:'id_tipo_evento'
            }
        },
        idUsuario:{
            type:DataTypes.UUID,
            allowNull:false,
            primaryKey:true,
            references:{
                model:Usuario,
                key:'codigo_usu'
            }
        }
    },{
        sequelize,
        modelName:'Evento',
        tableName:'EVENTO',
        timestamps:false,
        underscored:true
    }
);

Usuario.hasMany(Evento,{foreignKey:'idUsuario'});
TipoEvento.hasMany(Evento,{foreignKey:'idTipoEvento'});


export default Evento;