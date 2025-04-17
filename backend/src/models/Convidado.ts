import { Model, DataTypes, INTEGER } from 'sequelize';
import { sequelize } from '../config/database';
import Evento from './Evento';
import Convite from './Convite';


class Convidado extends Model {
  declare idConvidado: number;
  declare nome: string;
  declare email: string;
  declare dataNascimento: Date;
  declare rg: string;
  declare status: string;
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
      allowNull: false,
      unique: true
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
  sequelize,
  modelName: 'Convidado',
  tableName: 'CONVIDADO',
  timestamps: false,
  underscored: true
});


Convidado.hasOne(Convite, { foreignKey: 'idConvidado', as: 'Convite' });
Convite.belongsTo(Convidado, { foreignKey: 'idConvidado', as: 'Convidado' });


export default Convidado;