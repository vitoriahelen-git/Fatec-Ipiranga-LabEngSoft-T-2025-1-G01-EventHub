import { Op, Transaction } from "sequelize";
import Servico from '../models/Servico';
import Usuario from "../models/Usuario";
import TipoServico from "../models/TipoServico";

export default class ServicoDao{
    public cadastrarServico = async (idUsuario: string, idTipoServico: number, nomeServico:string, descricaoServico:string, unidadeCobranca: string, valorServico:number, qntMinima: number, qntMaxima:number, imagem1:string, imagem2:string | null, imagem3:string | null,imagem4:string | null, imagem5:string | null, imagem6:string | null, transaction: Transaction | null = null)=>{
        const servico: Servico = await Servico.create({
            idUsuario,
            idTipoServico,
            nomeServico,
            descricaoServico,
            unidadeCobranca,
            valorServico,
            qntMinima,
            qntMaxima,
            imagem1,
            imagem2,
            imagem3,
            imagem4,
            imagem5,
            imagem6 
        }, transaction ? {transaction} : {});
        return servico;
    }

    public buscarServicoPorId = async (idServico: string):Promise<Servico | null> =>{
        const servico: Servico | null = await Servico.findByPk(idServico);
        return servico;
    }
    
    public listarServicos = async (emailUsu: string):Promise<Servico[]> =>{
        const usuario: Usuario | null = await Usuario.findOne({
            where: {
                emailUsu
            }
        });
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        const idUsuario = usuario?.codigoUsu;

        const servicos: Servico[] = await Servico.findAll({
            where: {
                idUsuario
            }
        });
        return servicos;
    }

    public editarServico = async (  id: number,
        dadosAtualizados: {
            nomeServico: string,
            descricaoServico: string,
            idTipoServico : string,
            unidadeCobranca: string,
            valorServico: string,
            valorPromoServico: string | null,
            qntMinima: string,
            qntMaxima: string,
            imagem1: string,
            imagem2: string | null,
            imagem3: string | null,
            imagem4: string | null,
            imagem5: string | null,
            imagem6: string | null
        }
      ) => {
        const servico = await Servico.findByPk(id);
        
      
        if (!servico) {
          return null;
        }
        await servico.update({
          nomeServico: dadosAtualizados.nomeServico,
          descricaoServico: dadosAtualizados.descricaoServico,
          idTipoServico: dadosAtualizados.idTipoServico,
          unidadeCobranca: dadosAtualizados.unidadeCobranca,
          valorServico: dadosAtualizados.valorServico,
          valorPromoServico: dadosAtualizados.valorPromoServico,
          qntMinima: dadosAtualizados.qntMinima,
          qntMaxima: dadosAtualizados.qntMaxima,
            imagem1: dadosAtualizados.imagem1,
            imagem2: dadosAtualizados.imagem2,
            imagem3: dadosAtualizados.imagem3,
            imagem4: dadosAtualizados.imagem4,
            imagem5: dadosAtualizados.imagem5,
            imagem6: dadosAtualizados.imagem6
        });
      
        return servico;
    }

        public deletarServico = async (idServico: string) => {
        await Servico.destroy({
            where: {
                idServico
            }
        });
    }

    public anunciarServico = async (idServico: string, dataInicioAnuncio: Date | null, dataFimAnuncio: Date | null) => {
        const servico: Servico | null = await Servico.findByPk(idServico);
        if (!servico) {
            throw new Error("Serviço não encontrado");
        }
        
        servico.dataInicioAnuncio = dataInicioAnuncio;
        servico.dataFimAnuncio = dataFimAnuncio;
        servico.anunciado = true;

        await servico.save();
        return servico;
    }

    public encerrarAnuncioServico = async (idServico: string) => {
        const servico: Servico | null = await Servico.findByPk(idServico);
        if (!servico) {
            throw new Error("Serviço não encontrado");
        }
        
        servico.dataInicioAnuncio = null;
        servico.dataFimAnuncio = null;
        servico.anunciado = false;

        await servico.save();
        return servico;
    }

    public desativarAnunciosExpirados = async () => {
        const dataAtual = new Date();

        await Servico.update(
            {
                anunciado: false,
                dataInicioAnuncio: null,
                dataFimAnuncio: null,
            },
            {
                where: {
                    anunciado: true,
                    dataFimAnuncio: {
                        [Op.lt]: dataAtual,
                    },
                },
            }
        );
    };

    public consultarServicosAnunciados = async () => {
        const dataAtual = new Date();

        const servicosAnunciados: Servico[] = await Servico.findAll({
            where: {
                anunciado: true,
                [Op.and]: [
                {
                    [Op.or]: [
                    { dataInicioAnuncio: { [Op.lte]: dataAtual } },
                    { dataInicioAnuncio: null }
                    ]
                },
                {
                    [Op.or]: [
                    { dataFimAnuncio: { [Op.gte]: dataAtual } },
                    { dataFimAnuncio: null }
                    ]
                }
                ]
            },
            attributes: {
                exclude: ['idUsuario', 'idTipoServico']
            },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['codigoUsu', 'nomeEmpresa', 'fotoEmpresa']
                },
                {
                    model: TipoServico,
                    as: 'tipoServico',
                    attributes: ['idTipoServico', 'descricaoTipoServico']
                }
            ]
        });

        return servicosAnunciados;
    }
}