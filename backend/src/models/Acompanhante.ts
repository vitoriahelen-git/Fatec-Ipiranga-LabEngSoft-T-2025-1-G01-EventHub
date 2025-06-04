import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Convidado from './Convidado';

class Acompanhante extends Model {
    declare idConvidado: string;
    declare idAcompanhante: string;
    declare relacionamento: string;
}

Acompanhante.init({
    idConvidado: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references:{
            model: Convidado,
            key:'id_convidado'
        }
    },
    idAcompanhante: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references:{
            model: Convidado,
            key:'id_convidado'
        }
    },
    relacionamento: {
        type: DataTypes.STRING,
        allowNull: false
    }}, {
        sequelize,
        modelName: 'Acompanhante',
        tableName: 'ACOMPANHANTE',
        timestamps: false,
        underscored: true
    }
);

export default Acompanhante;