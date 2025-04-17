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
        cepLocal:{
            type:DataTypes.STRING(9),
            allowNull:true
        },
        enderecoLocal:{
            type:DataTypes.STRING(100),
            allowNull:true
        },
        numeroLocal:{
            type:DataTypes.STRING(10),
            allowNull:true
        },
        complementoLocal:{
            type:DataTypes.STRING(50),
            allowNull:true
        },
        bairroLocal:{
            type:DataTypes.STRING(50),
            allowNull:true
        },
        cidadeLocal:{
            type:DataTypes.STRING(50),
            allowNull:true
        },
        ufLocal:{
            type:DataTypes.STRING(2),
            allowNull:true
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
        descricaoEvento:{
            type:DataTypes.STRING(2000),
            allowNull:true
        },
        imagemEvento:{
            type:DataTypes.STRING(100),
            allowNull:true
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
            references:{
                model:Usuario,
                key:'codigo_usu'
            }
        },
    },{
        sequelize,
        modelName:'Evento',
        tableName:'EVENTO',
        timestamps:false,
        underscored:true
    }
);

Usuario.hasMany(Evento,{foreignKey:'idUsuario',   onDelete: 'CASCADE'});
TipoEvento.hasMany(Evento,{foreignKey:'idTipoEvento',   onDelete: 'CASCADE'});


export default Evento;