import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Usuario from './Usuario'; 
import Tipo from './Tipo';

class UsuarioTipo extends Model {
  declare idUsu: string;
  declare idTipo: number;
}

UsuarioTipo.init({
    idUsu : {
      type: DataTypes.UUID, 
      primaryKey: true, 
      allowNull: false, 
      references:{
        model:Usuario,
        key:'codigo_usu'
      }
    },
    idTipo : {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false,
      references:{
        model:Tipo,
        key:'id_tipo'
      }
    }
  }, {
    sequelize,
    modelName: 'UsuarioTipo',
    tableName: 'USUARIO_TIPO',
    timestamps: false,
    underscored: true
});

Usuario.belongsToMany(Tipo,{through:UsuarioTipo,foreignKey:'idUsu'})
Tipo.belongsToMany(Usuario,{through:UsuarioTipo,foreignKey:'idTipo'})


export default UsuarioTipo