import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Servico from "./Servico";
import Pedido from "./Pedido"

class ItemPedido extends Model {
    declare idItemPedido: number; // Chave primária do item do pedido
    declare idPedido: number; // Chave estrangeira referenciando o pedido ao qual o item pertence
    declare idServico: number; // Chave estrangeira referenciando o serviço relacionado ao item do pedido
    declare valorUnitario: number; // Valor unitário do serviço no momento do pedido
    declare nomeItem: string; // Nome do item do pedido
    declare quantidade: number; // Quantidade do serviço no item do pedido
    declare instrucao: string | null; // Instruções adicionais para o item do pedido
    declare valorTotal: number; // Valor total do item do pedido (valorUnitario * quantidade)
}

ItemPedido.init(
    {
        idItemPedido: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        idPedido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        idServico: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        valorUnitario: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false
        },
        nomeItem: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        instrucao: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        valorTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "ItemPedido",
        tableName: "ITEM_PEDIDO",
        timestamps: false
    }
);


// Associações
Servico.hasMany(ItemPedido, {
    foreignKey: "idServico",
    onDelete: "CASCADE",
});
ItemPedido.belongsTo(Servico, {
    foreignKey: "idServico",
    targetKey: "idServico",
    onDelete: "CASCADE"
});
Pedido.hasMany(ItemPedido, {
    foreignKey: "idPedido",
    onDelete: "CASCADE",
});
ItemPedido.belongsTo(Pedido, {
    foreignKey: "idPedido",
    targetKey: "idPedido",
    onDelete: "CASCADE"
});

export default ItemPedido;