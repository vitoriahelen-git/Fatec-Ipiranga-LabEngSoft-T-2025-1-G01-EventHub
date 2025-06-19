import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Usuario from './Usuario';
import Evento from './Evento';  

class Pedido extends Model {
    declare idPedido: number;
    declare codigoUsu: string; // ID do usuário que fez o pedido
    declare idEvento: number; // ID do evento relacionado ao pedido
    declare dataPedido: Date; // Data em que o pedido foi feito
    declare localEntrega?: string; // Local onde o pedido deve ser entregue
    declare dataEntrega: Date; // Data em que o pedido deve ser entregue
    declare status: string; // Status do pedido (ex: 'Pendente', 'Em Andamento', 'Concluído', 'Cancelado')
    declare valorTotal: number; // Valor total do pedido, calculado a partir dos itens do pedido
}

Pedido.init(
    {
        idPedido: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        codigoUsu: {
            type: DataTypes.UUID,
            allowNull: false
        },
        idEvento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dataPedido: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        localEntrega: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        dataEntrega: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Pendente'
        },
        valorTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        }
    },
    {
        sequelize,
        modelName: 'Pedido',
        tableName: 'PEDIDO',
        timestamps: false
    }
);

// Associações
Usuario.hasMany(Pedido, {
    foreignKey: 'codigoUsu',
    sourceKey: 'codigoUsu'
});
Pedido.belongsTo(Usuario, {
    foreignKey: 'codigoUsu',
    targetKey: 'codigoUsu'
});
Evento.hasMany(Pedido, {
    foreignKey: 'idEvento',
    sourceKey: 'idEvento'
});
Pedido.belongsTo(Evento, {
    foreignKey: 'idEvento',
    targetKey: 'idEvento'
});

export default Pedido;
