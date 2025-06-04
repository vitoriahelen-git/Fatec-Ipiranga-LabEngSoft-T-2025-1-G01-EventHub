import { Model , DataTypes, INTEGER } from 'sequelize';
import { sequelize } from '../config/database';
import Evento from './Evento';


class Convite extends Model {
    declare idConvite: number;
    declare idEvento: number;
    declare dataConvite: Date;
    declare status: string;
    declare qtdMaxAcompanhantes: number;
}

Convite.init({
    idConvite: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
        },
    idEvento: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: Evento,
          key: 'id_evento'
        },
        field: 'id_evento', 
    },
    dataConvite: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qtdMaxAcompanhantes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Convite',
    tableName: 'CONVITE',
    timestamps: false,
    underscored: true
});

Convite.belongsTo(Evento, { foreignKey: 'idEvento',   onDelete: 'CASCADE' });
Evento.hasMany(Convite, { foreignKey: 'idEvento',   onDelete: 'CASCADE' });



export default Convite;
