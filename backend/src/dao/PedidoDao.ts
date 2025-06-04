import { col, fn, Transaction } from "sequelize";
import { sequelize } from "../config/database";
import Pedido from "../models/Pedido";
import ItemPedido from "../models/ItemPedido";
import Evento from "../models/Evento";
import Servico from "../models/Servico";

export default class PedidoDao {
    public finalizarPedido = async (
        codigoUsu: string,
        idEvento: number,
        itens: {
            idServico: string;
            nomeItem: string;
            valorUnitario: number;
            quantidade: number;
            instrucao?: string;
        }[]
    ) => {
        const t: Transaction = await sequelize.transaction(); //transação para caso algo de errado usar o rollback

        try {
            const pedido = await Pedido.create({ //gravando o pedido no banco sem os itens por enquanto (e sem total)
                codigoUsu: codigoUsu,
                idEvento,
                status: 'pendente',
                dataCriacao: new Date(),
            }, { transaction: t });

            let valorTotal = 0;                 //partindo pro calculo do valor total do pedido
            for (const item of itens) {         //iterando sobre cada item do pedido
                const subtotal = item.valorUnitario * item.quantidade;  //calculando o total de cada item a partir da quantidade e preço unitario
                valorTotal += subtotal; //incrementando o valor total do pedido

                await ItemPedido.create({
                    idPedido: pedido.idPedido,
                    idServico: item.idServico,
                    nomeItem: item.nomeItem,
                    valorUnitario: item.valorUnitario,
                    quantidade: item.quantidade,
                    instrucao: item.instrucao,
                    valorTotal: subtotal,
                }, { transaction: t });
            }


            pedido.valorTotal = valorTotal;
            await pedido.save({ transaction: t });
            await t.commit();

            return pedido;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    public listarPedidos = async (codigoUsu: string) => {
        const pedidos = await Pedido.findAll({
            where: { codigoUsu: codigoUsu },
            attributes: [
                'idPedido',
                'codigoUsu',
                'dataPedido',
                'valorTotal',
                [fn('COUNT', col('idItemPedido')), 'quantidadeItens'],
            ],
            include: [
                {
                    model: ItemPedido,
                    as: 'ItemPedidos',
                    attributes: [],
                    required: false,
                },
                {
                    model: Evento,
                    as: 'Evento',
                    attributes: ['nomeEvento'],
                },
            ],
            group: ['Pedido.idPedido', 'idEvento'],
            order: [['dataPedido', 'DESC']],
            raw: true,
            nest: true,
        });

        return pedidos;
    };

    public cancelarPedido = async (idPedido: string) => {
    const pedido = await Pedido.findByPk(idPedido, {
        include: [{ model: Evento, as: 'Evento' }], // Traz o evento junto com inner join
    });

    if (!pedido) {
        throw new Error('Pedido não encontrado');
    }

    const evento = (pedido as any).Evento;

    if (!evento || !evento.dataEvento) {
        throw new Error('Evento associado não encontrado ou sem data definida');
    }

    const agora = new Date();
    const dataEvento = new Date(evento.dataEvento);
    const diffHoras = (dataEvento.getTime() - agora.getTime()) / (1000 * 60 * 60); //verifica a diferença em horas

    if (diffHoras <= 48) {
        throw new Error('Não é possível cancelar pedidos para eventos que ocorrerão em menos de 48 horas'); 
    }

    pedido.status = 'cancelado';
    await pedido.save();
    return pedido;
    };

    public listarItensPedido = async (idPedido: number) => {
            const itens = await ItemPedido.findAll({
            where: { idPedido: idPedido },
            attributes: ['idItemPedido', 'idServico', 'nomeItem', 'valorUnitario', 'quantidade', 'instrucao', 'valorTotal'],
            include: [
                {
                model: Servico,
                attributes: ['imagem1'],
                }
            ]
            });
        const nomeEvento = await Pedido.findOne({
            where: { idPedido: idPedido },
            attributes: ['idEvento'],
            include: [{
                model: Evento,
                as: 'Evento',
                attributes: ['nomeEvento']
            }],
            raw: true,
        });

        return {
            itens, 
            nomeEvento: nomeEvento ? (nomeEvento as { [key: string]: any })['Evento.nomeEvento'] : null
        };
    }

}
