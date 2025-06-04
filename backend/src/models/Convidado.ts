import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Convite from './Convite';
import Acompanhante from './Acompanhante';

class Convidado extends Model {
  declare idConvidado: string;
  declare nome: string;
  declare email: string;
  declare dataNascimento: Date;
  declare rg: string;
  declare status: string;
  declare idConvite: string;
  declare acompanhantes?: Convidado[];
}

Convidado.init({
    idConvidado: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idConvite: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Convite,
        key: 'id_convite'
      }
    }
  }, {
  sequelize,
  modelName: 'Convidado',
  tableName: 'CONVIDADO',
  timestamps: false,
  underscored: true
});

Convidado.belongsTo(Convite, { foreignKey: 'idConvite', as: 'convite' });
Convite.hasMany(Convidado, { foreignKey: 'idConvite', as: 'convidados' });

Convidado.belongsToMany(Convidado, {
  through: Acompanhante,
  as: 'acompanhantes',             
  foreignKey: 'idConvidado',
  otherKey: 'idAcompanhante'
});

Convidado.belongsToMany(Convidado, {
  through: Acompanhante,
  as: 'convidador',                
  foreignKey: 'idAcompanhante',
  otherKey: 'idConvidado'
});

export default Convidado;