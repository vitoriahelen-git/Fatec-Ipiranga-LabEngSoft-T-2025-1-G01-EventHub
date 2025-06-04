import PedidoDAO from '../dao/PedidoDao';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export default class PedidoController {
    private pedidoDao = new PedidoDAO();

    public finalizarPedido = async (req: AuthenticatedRequest, res: any) => {
        try {
            const { idEvento, itens } = req.body;
            const codigoUsu = req.user!.id.toString();

            if (!Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({ mensagem: "Nenhum item informado" });
            }

            const novoPedido = await this.pedidoDao.finalizarPedido(codigoUsu, Number(idEvento), itens);
            res.status(201).json(novoPedido);
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            res.status(500).json({ mensagem: "Erro interno ao criar pedido" });
        }
    }

    public listarPedidos = async (req: any, res: any) => {
        try {
            const codigoUsu = req.user!.id.toString();
            const pedidos = await this.pedidoDao.listarPedidos(codigoUsu);
            res.status(200).json(pedidos);
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            res.status(500).json({ mensagem: "Erro interno ao listar pedidos" });
        }
    }

    public cancelarPedido = async (req: any, res: any) => {
        const { idPedido } = req.body;

        try {
            const pedido = await this.pedidoDao.cancelarPedido(idPedido);
            if (!pedido) {
                return res.status(404).json({ mensagem: "Pedido não encontrado" });
            }
            res.status(200).json({ mensagem: "Pedido cancelado com sucesso" });
        } catch (error) {
            console.error("Erro ao cancelar pedido:", error);
            res.status(500).json({ mensagem: "Erro interno ao cancelar pedido" });
        }
    }

    public listarItensPedido = async (req: any, res: any) => {
        const { idPedido } = req.params;

        try {
            const pedidoItens = await this.pedidoDao.listarItensPedido(Number(idPedido));
            if (!pedidoItens.itens || pedidoItens.itens.length === 0) {
                return res.status(200).json({ mensagem: "Nenhum item encontrado para este pedido" });
            }
            res.status(200).json(pedidoItens);
        } catch (error) {
            console.error("Erro ao listar itens do pedido:", error);
            res.status(500).json({ mensagem: "Erro interno ao listar itens do pedido" });
        }
    }

}