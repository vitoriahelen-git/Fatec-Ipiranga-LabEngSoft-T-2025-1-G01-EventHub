import { col, fn, Transaction } from "sequelize";
import { sequelize } from "../config/database";
import Pedido from "../models/Pedido";
import ItemPedido from "../models/ItemPedido";
import Evento from "../models/Evento";
import Servico from "../models/Servico";
import Usuario from "../models/Usuario";

export default class PedidoDao {
    public finalizarPedido = async (
        codigoUsu: string,
        idEvento: number,
        localEntrega: string,
        dataEntrega: Date,
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
                localEntrega: localEntrega,
                dataEntrega: dataEntrega,
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

    public listarPedidosPrestador = async (codigoUsu: string) => {
        const pedidos = await Pedido.findAll({
            attributes: [
                'idPedido',
                'dataPedido',
                [fn('SUM', col('ItemPedidos.valorTotal')), 'valorTotalDoPrestador'],
                'status',
                'codigoUsu',
                'localEntrega',
                'dataEntrega',
                [sequelize.fn('COUNT', sequelize.col('ItemPedidos.idItemPedido')), 'quantidadeItens']
            ],
            include: [
                {
                model: ItemPedido,
                as: 'ItemPedidos',
                required: true,
                attributes: [],
                include: [
                    {
                    model: Servico,
                    as: 'Servico',
                    attributes: [],
                    where: {
                        idUsuario: codigoUsu
                    }
                    }
                ]
                },
                {
                model: Evento,
                as: 'Evento',
                attributes: ['nomeEvento'],
                include: [
                    {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['nomeUsu']
                    }
                ]
                }
            ],
            group: [
                'Pedido.idPedido',
            ],
            order: [['dataPedido', 'DESC']],
            raw: true,
            nest: true
            });
        return pedidos;
    }

    public listarItensPedidoPrestador = async (idPedido: number, codigoUsu: string) => {
        const itens = await ItemPedido.findAll({
            where: { idPedido: idPedido },
            attributes: ['idItemPedido', 'idServico', 'nomeItem', 'valorUnitario', 'quantidade', 'instrucao', 'valorTotal'],
            include: [
                {
                    model: Servico,
                    as: 'Servico',
                    attributes: ['imagem1'],
                    where: { idUsuario: codigoUsu }
                }
            ]
        });

        const pedido = await Pedido.findOne({
            where: { idPedido: idPedido },
            attributes: ['idPedido', 'codigoUsu', 'dataPedido', 'valorTotal', 'localEntrega', 'dataEntrega'],
            include: [
                {
                    model: Evento,
                    as: 'Evento',
                    attributes: ['nomeEvento'],
                    include: [
                        {
                            model: Usuario,
                            as: 'Usuario',
                            attributes: ['nomeUsu', 'telUsu']
                        }
                    ]
                }
            ],
            raw: true,
            nest: true
        }) as unknown as {
            idPedido: number;
            codigoUsu: string;
            dataPedido: Date;
            valorTotal: number;
            localEntrega: string;
            dataEntrega: Date;
            Evento: {
                nomeEvento: string;
                Usuario: {
                    nomeUsu: string;
                    telUsu: string;
                }
            }
        } | null;

        if (!pedido) {
            throw new Error('Pedido não encontrado');
        }

        return {
            itens,
            pedido: {
                idPedido: pedido.idPedido,
                codigoUsu: pedido.codigoUsu,
                dataPedido: pedido.dataPedido,
                localEntrega: pedido.localEntrega,
                dataEntrega: pedido.dataEntrega,
                nomeEvento: pedido.Evento.nomeEvento,
                nomeCliente: pedido.Evento.Usuario.nomeUsu,
                telefoneCliente: pedido.Evento.Usuario.telUsu,
            }
        };
    }



}
