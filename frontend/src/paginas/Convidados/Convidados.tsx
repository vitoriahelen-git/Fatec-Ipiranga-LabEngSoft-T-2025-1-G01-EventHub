import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import './Convidados.css';
import Botao from "../../componentes/Botao/Botao";
import { Modal } from "../../componentes/Modal/Modal";
import api from "../../axios";



interface Evento{
    idEvento: number;
    nomeEvento: string;
    status?: string;
    dataEvento: string;
    horaInicio: string;
    horaFim: string;
    cepLocal: string;
    enderecoLocal: string;
    numeroLocal: string;
    complementoLocal: string;
    bairroLocal: string;
    cidadeLocal: string;
    ufLocal: string;
    imagem?: string;
    tipoEvento?: string;
    descricaoEvento?: string;
  }

  export interface Convidado {
    idConvidado: string;
    nome: string;
    email: string;
    dataNascimento: string;
    rg: string;
    status: 'Confirmado' | 'Recusado' | 'Pendente';
  }



const Convidados = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [modalConfirmarPresencas, setModalConfirmarPresencas] = useState(false);
    const [indiceConvidadoPendente, setIndiceConvidadoPendente] = useState(0);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [preView, setPreview] = useState('')
    const [tipoEvento, setTipoEvento] = useState(0)
    const [carregandoImprimir, setCarregandoImprimir] = useState(false);

    const convidadosPendentes = convidados.filter(convidado => convidado.status === 'Pendente');
    const convidadoPendenteAtual = convidadosPendentes[indiceConvidadoPendente];

    const [botaoImprimirDesabilitado, setBotaoImprimirDesabilitado] = useState(true);

    useEffect(() => {
        try {
            api.get(`/users/get-user`)
            .then((res) => {
                setIdUsuario(res.data.idUsuario);
                api.get(`/users/${idUsuario}/events/${idEvento}`)
                    .then((res) => {
                        setEvento(res.data);
                        const status = definirStatusEvento(res.data);
                        setTipoEvento(res.data.idTipoEvento);
                        const urlPreview = res.data.imagemEvento
                        ? `http://localhost:3000/files/${res.data.imagemEvento}`
                        : '';
                        setPreview(urlPreview);
                        setEvento({ ...res.data, status });
                    })
                    .catch((err) => {
                        console.error("Erro ao buscar o evento", err);
                    });
            }) 
            .catch((err) => {
                console.error("Erro obter usuário", err);
              });
        } 
        catch (error) {
            console.error('Erro ao obter eventos', error);
        }}, [idEvento]);

        const irParaProximoConvidado = () => {
        if (indiceConvidadoPendente < convidadosPendentes.length - 1) {
            setIndiceConvidadoPendente(indiceConvidadoPendente + 1);
        }
        };

        const irParaConvidadoAnterior = () => {
        if (indiceConvidadoPendente > 0) {
            setIndiceConvidadoPendente(indiceConvidadoPendente - 1);
        }
        };

    const buscarConvidados = async (idEvento: string, setConvidados: Function) => {
        try {
          const response = await api.get(`/users/obter-convidados/${idEvento}`);
          setConvidados(response.data);
        } catch (error) {
            setBotaoImprimirDesabilitado(true);
          console.error('Erro ao buscar convidados:', error);
        }
      };



    useEffect(() => {
        const ObterEventoeUsuario = async () => {
            try {
                const res = await api.get(`/users/get-user`);
                setIdUsuario(res.data.codigoUsu);

            
                const evento = await api.get(`/users/${idUsuario}/events/${idEvento}`);
                setEvento(evento.data);
    
                if (idEvento) {
                    await buscarConvidados(idEvento, setConvidados);
                } else {
                    console.error('idEvento está indefinido.');
                }
              } catch (error) {
                console.error('Erro ao carregar dados:', error);
              }
            }
            ObterEventoeUsuario();
        }, [idEvento]);

        const atualizarStatusConvidado = async (idConvidado: string, novoStatus: 'Confirmado' | 'Recusado') => {
            try {
              await api.put(`/users/atualizar-status-convidado/${idConvidado}`, {
                status: novoStatus
              });

              setConvidados(prevConvidados =>
                prevConvidados.map(convidado =>
                  convidado.idConvidado === idConvidado ? { ...convidado, status: novoStatus } : convidado
                )
              );
          

              if (indiceConvidadoPendente < convidadosPendentes.length - 1) {
                setIndiceConvidadoPendente(indiceConvidadoPendente);
              } else {
                setModalConfirmarPresencas(false);
              }
          
            } catch (error) {
              console.error('Erro ao atualizar status do convidado:', error);
            }
          };

    useEffect(() => {
    const confirmados = convidados.filter((convidado: Convidado) => convidado.status === 'Confirmado');
    setBotaoImprimirDesabilitado(!(confirmados.length > 0));
    }, [convidados]);
    


      if (!evento) return <p>Carregando evento...</p>;



  function definirStatusEvento(evento: Evento): string {
    const agora = new Date();

    const dataEvento = new Date(evento.dataEvento);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataEvento.setHours(0, 0, 0, 0);

    const dataEhHoje = dataEvento.getTime() === hoje.getTime();

    const [horaIni, minIni] = evento.horaInicio.split(':').map(Number);
    const [horaFim, minFim] = evento.horaFim.split(':').map(Number);

    const inicio = new Date(evento.dataEvento);
    inicio.setHours(horaIni, minIni, 0, 0);

    const fim = new Date(evento.dataEvento);
    fim.setHours(horaFim, minFim, 0, 0);

    if (dataEhHoje) {
        if (agora >= inicio && agora <= fim) return 'Em Progresso';
        else if (agora < inicio) return 'Proximos Eventos';
        else return 'Evento Finalizado';
    } else if (dataEvento > hoje) {
        return 'Proximos Eventos';
    } else {
        return 'Evento Finalizado';
    }
}

    const gerarListaConvidados = async () => {
        try{
            if(carregandoImprimir) return;
            setCarregandoImprimir(true);
            const {data: pdf} = await api.get(`/users/gerar-lista-convidados/${idEvento}`, {responseType: 'blob'});
            const url = URL.createObjectURL(new Blob([pdf]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'lista_de_convidados.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            setCarregandoImprimir(false);
        }
        catch(e: any){
            console.error('Erro ao gerar lista de convidados:', e);
            setCarregandoImprimir(false);
        }
    }

  return (
    <div className="tela-convidados-evento">
        <div className="informacoes-evento__cabecalho">
            <CabecalhoEvento
                idEvento={idEvento} 
                evento={evento}
                preViewEv={preView}
                setEvento={setEvento}
                idUsuario={idUsuario}
            />
        </div>
        <div className="informacoes-evento__container">
        <div className="conteudo-convidados">
            <div className="convidados">
                <div className="titulo-convidados">Convidados</div>
                    <div className="botoes-convidados">
                        <div className="atualizar-lista-convidados">
                            <div className='texto-atualizar-convidados'>Atualizar convidados </div>
                            <button className="botao-atualizar" onClick={() => idEvento && buscarConvidados(idEvento, setConvidados)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M18.1055 8.74955H18.4375C18.957 8.74955 19.375 8.33158 19.375 7.81205V2.81205C19.375 2.43314 19.1484 2.08939 18.7969 1.94486C18.4453 1.80033 18.043 1.87845 17.7734 2.14798L16.1484 3.77298C12.7266 0.394079 7.21484 0.405797 3.8125 3.81205C0.394531 7.23002 0.394531 12.7691 3.8125 16.187C7.23047 19.605 12.7695 19.605 16.1875 16.187C16.6758 15.6988 16.6758 14.9058 16.1875 14.4175C15.6992 13.9292 14.9062 13.9292 14.418 14.4175C11.9766 16.8589 8.01953 16.8589 5.57812 14.4175C3.13672 11.9761 3.13672 8.01908 5.57812 5.57767C8.00781 3.14798 11.9336 3.13627 14.3789 5.53861L12.7734 7.14798C12.5039 7.41752 12.4258 7.81986 12.5703 8.17142C12.7148 8.52298 13.0586 8.74955 13.4375 8.74955H18.1055Z" fill="white"/>
                                </svg>
                            </button>
                        </div>
                        <div className="confirmar-presencas">
                            <Botao funcao={() => setModalConfirmarPresencas(true)} texto='Confirmar Presenças'/>
                        </div>
                        <div className="imprimir-lista">
                            <Botao 
                                funcao={gerarListaConvidados} 
                                texto={
                                    carregandoImprimir ? 
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                    : 'Imprimir lista'
                                }
                                desabilitado={botaoImprimirDesabilitado}
                            />
                        </div>
                    </div>
                    <table className="tabela-convidados">
                        <thead>
                            <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Data de nascimento</th>
                            <th>RG</th>
                            <th>Status</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {convidados.map(convidado => (
                            <tr key={convidado.idConvidado}>
                                <td>{convidado.nome}</td>
                                <td>{convidado.email}</td>
                                <td>{new Date(convidado.dataNascimento).toLocaleDateString()}</td>
                                <td>{convidado.rg}</td>
                                <td>
                                <span className={`status-convidado ${convidado.status.toLowerCase()}`}>
                                    {convidado.status}
                                </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        { modalConfirmarPresencas ? 
                        <Modal botoes={false} textoBotao='Confirmar' funcaoSalvar={() => setModalConfirmarPresencas(false)} enviaModal={() => setModalConfirmarPresencas(false)} titulo="Confirmar Presenças">
                        <div className="modal-confirmar-presenca">
                            <div className="caixa-convidados-pendentes-botoes">
                                <div className="convidados-pendentes-botoes">
                                <div className="numero-pendentes">{convidadosPendentes.length}</div>
                                <div className="texto-convidados-pendentes">Convidados pendentes</div>
                                <div className="botoes-convidados-pendentes">
                                    {
                                        convidadosPendentes.length >= 1 &&
                                        <div className="botoes-anterior-proximo">
                                            {
                                                indiceConvidadoPendente > 0 &&
                                                <Botao texto="Anterior" funcao={irParaConvidadoAnterior} />
                                            }
                                            {
                                                indiceConvidadoPendente < convidadosPendentes.length - 1 &&
                                                <Botao texto="Próximo" funcao={irParaProximoConvidado} />
                                            }
                                        </div>
                                    }
                                </div>
                                </div>
                            </div>

                            {convidadoPendenteAtual && (
                                <>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">Nome do convidado</div>
                                    <div className="dados-convidado">{convidadoPendenteAtual.nome}</div>
                                </div>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">E-mail</div>
                                    <div className="dados-convidado">{convidadoPendenteAtual.email}</div>
                                </div>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">Data de Nascimento</div>
                                    <div className="dados-convidado">
                                    {new Date(convidadoPendenteAtual.dataNascimento).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">RG</div>
                                    <div className="dados-convidado">{convidadoPendenteAtual.rg}</div>
                                </div>
                                </>
                            )}
                            {
                                convidadosPendentes.length > 0 &&
                                <div className="botoes-acoes-convidado">
                                    <Botao
                                        texto="Recusar"
                                        funcao={() => {
                                        if (convidadoPendenteAtual) {
                                            atualizarStatusConvidado(convidadoPendenteAtual.idConvidado, 'Recusado');
                                        }
                                        }}
                                    />
                                    <Botao
                                        texto="Confirmar"
                                        funcao={() => {
                                        if (convidadoPendenteAtual) {
                                            atualizarStatusConvidado(convidadoPendenteAtual.idConvidado, 'Confirmado');
                                        }
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    </Modal>:
                    ''}
                </div>
            </div>
        </div>
    </div>
)
}

export default Convidados