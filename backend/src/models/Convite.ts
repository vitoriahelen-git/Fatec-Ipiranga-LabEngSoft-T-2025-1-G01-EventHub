import { Model , DataTypes, INTEGER } from 'sequelize';
import { sequelize } from '../config/database';
import Evento from './Evento';


class Convite extends Model {
  public idConvite!: number;
  public idEvento!: number;
  public idConvidado!: number;
  public linkConvite!: string;
  public dataConvite!: Date;
  public status!: string;
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
    idConvidado: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'CONVIDADO',
            key: 'id_convidado'
        },
    },
    linkConvite: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataConvite: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
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
