import { DataTypes,Model } from "sequelize";
import { sequelize } from "../config/database";
import Usuario from "./Usuario";
import TipoServico from './TipoServico'

class Servico extends Model{
    declare idServico: number;
    declare idUsuario:string;
    declare nomeServico: string;
    declare idTipoServico: number;
    declare descricaoServico: string;
    declare unidadeCobranca: string;
    declare valorServico: number;
    declare valorPromoServico: number | null;
    declare qntMinima: number;
    declare qntMaxima: number;
    declare imagem1: string;
    declare imagem2: string;
    declare imagem3: string;
    declare imagem4: string;
    declare imagem5: string;
    declare imagem6: string;
    declare anunciado: boolean;
    declare dataInicioAnuncio: Date | null;
    declare dataFimAnuncio: Date | null;
}

Servico.init(
    {
        idServico:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        nomeServico:{
            type:DataTypes.STRING(100),
            allowNull:false
        },
        descricaoServico:{
            type:DataTypes.STRING(4000),
            allowNull:false
        },
        unidadeCobranca:{
            type:DataTypes.STRING,
            allowNull:false
        },
        valorServico:{
            type:DataTypes.DECIMAL(9,2),
            allowNull:false
        },
        valorPromoServico:{
            type:DataTypes.DECIMAL(9,2),
            allowNull:true,
            defaultValue: null
        },
        qntMinima:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        qntMaxima:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        imagem1:{
            type:DataTypes.STRING(400),
            allowNull:false
        },
        imagem2:{
            type:DataTypes.STRING(400),
            allowNull:true
        },
        imagem3:{
            type:DataTypes.STRING(400),
            allowNull:true
        },
        imagem4:{
            type:DataTypes.STRING(400),
            allowNull:true
        },
        imagem5:{
            type:DataTypes.STRING(400),
            allowNull:true
        },
        imagem6:{
            type:DataTypes.STRING(400),
            allowNull:true
        },
        idTipoServico:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:TipoServico,
                key:'id_tipo_servico'
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
        anunciado:{
            type:DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull:true
        },
        dataInicioAnuncio:{
            type:DataTypes.DATE,
            allowNull:true
        },
        dataFimAnuncio:{
            type:DataTypes.DATE,
            allowNull:true
        }
    },{
        sequelize,
        modelName:'Servico',
        tableName:'SERVICO',
        timestamps:false,
        underscored:true
    }
);

Usuario.hasMany(Servico,{foreignKey:'idUsuario',   onDelete: 'CASCADE'});
TipoServico.hasMany(Servico,{foreignKey:'idTipoServico', onDelete:'CASCADE'});

Servico.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
Servico.belongsTo(TipoServico, { foreignKey: 'idTipoServico', as: 'tipoServico' });

export default Servico;