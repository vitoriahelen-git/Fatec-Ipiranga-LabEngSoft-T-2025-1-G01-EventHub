import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import './Convites.css';
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

  export interface Convite {
    idConvite: string;
    linkConvite: string;
    dataConvite: string;
    status: 'Utilizado' | 'Pendente';
  }

const Convites = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [modoApagarConvite, setModoApagarConvite] = useState(false);
    const [convites, setConvites] = useState<Convite[]>([]);
    const [linkConvite, setLinkConvite] = useState<string | null>(null);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [idConviteApagado, setIdConviteApagado] = useState('');
    const [preView, setPreview] = useState('')
    const [tipoEvento, setTipoEvento] = useState(0)

    useEffect(() => {
      try {
          api.get(`/users/get-user`)
          .then((res) => {
              setIdUsuario(res.data.idUsuario);
              api.get(`/users/${idUsuario}/events/${idEvento}`)
                  .then((res) => {
                      setEvento(res.data);
                      setTipoEvento(res.data.idTipoEvento);
                        const urlPreview = res.data.imagemEvento
                        ? `http://localhost:3000/files/${res.data.imagemEvento}`
                        : '';
                      setPreview(urlPreview);
                      const status = definirStatusEvento(res.data);
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

    const gerarConvite = async () => {
        try {
          const response = await api.post(`/users/gerar-convite/${idEvento}`);
          setLinkConvite(response.data.linkConvite);
          console.log("res data", response.data.linkConvite);
          console.log("linkConvite", linkConvite)
        } catch (error) {
          console.error("Erro ao gerar convite:", error);
          alert("Erro ao gerar o link de convite.");
        }
      };

      useEffect(() => {
        if (linkConvite) {
          console.log("linkConvite atualizado:", linkConvite);
        }
      }, [linkConvite]);


      const copiarLink = async () => {
        if (linkConvite) {
          await navigator.clipboard.writeText(linkConvite);
          setLinkConvite(null);
        }
      };


    const buscarConvites = async (idEvento: string, setConvites: Function) => {
        try {
          const response = await api.get(`/users/obter-convites/${idEvento}`);
          setConvites(response.data);
        } catch (error) {
          console.error('Erro ao buscar convites:', error);
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
                    await buscarConvites(idEvento, setConvites);
                } else {
                    console.error('idEvento está indefinido.');
                }
              } catch (error) {
                console.error('Erro ao carregar dados:', error);
              }
            }
            ObterEventoeUsuario();
        }, [idEvento]);

        const deletarConvite = async (idConvite:any) => {
            try {
            console.log('idConvite', idConvite)
            console.log('deletarConvite', idConvite)
              await api.delete(`/users/deletar-convite/${idConvite}`);
              setConvites(prevConvites => prevConvites.filter(convite => convite.idConvite !== idConvite));
            } catch (error) {
              console.error("Erro ao deletar convite:", error);
              alert("Erro ao deletar convite.");
            }
          };
    


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


    const abrirModalApagarConvite = (idConvite: string) => {
      setModoApagarConvite(!modoApagarConvite)
      setIdConviteApagado(idConvite)
    }



      if (!evento) return <p>Carregando evento...</p>;

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
                    <div className="titulo-convidados">Convites</div>
                        <div className="botoes-convidados">
                            <div className="confirmar-presencas">
                                <Botao funcao={gerarConvite} texto='Gerar Convites'/>
                            </div>
                        </div>
                        <table className="tabela-convidados">
                            <thead>
                                <tr>
                                <th>Convite</th>
                                <th>Gerado em</th>
                                <th>Status</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {convites.map(convite => (
                                <tr key={convite.idConvite}>
                                    <td>{convite.linkConvite}</td>
                                    <td>{new Date(convite.dataConvite).toLocaleDateString()}</td>
                                    <td>
                                    <span className={`status-convidado ${convite.status.toLowerCase()}`}>
                                        {convite.status}
                                    </span>
                                    </td>
                                    <td>
                                    <div className="excluir-convite" onClick={() => abrirModalApagarConvite(convite.idConvite)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <path d="M12.3828 2.58853C12.8711 2.12466 12.8711 1.37134 12.3828 0.907471C11.8945 0.443604 11.1016 0.443604 10.6133 0.907471L6.5 4.8188L2.38281 0.911182C1.89453 0.447314 1.10156 0.447314 0.613281 0.911182C0.125 1.37505 0.125 2.12837 0.613281 2.59224L4.73047 6.49985L0.617188 10.4112C0.128906 10.875 0.128906 11.6284 0.617188 12.0922C1.10547 12.5561 1.89844 12.5561 2.38672 12.0922L6.5 8.18091L10.6172 12.0885C11.1055 12.5524 11.8984 12.5524 12.3867 12.0885C12.875 11.6247 12.875 10.8713 12.3867 10.4075L8.26953 6.49985L12.3828 2.58853Z" fill="#CED4DA"/>
                                        </svg>
                                    </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                            {
                              modoApagarConvite &&
                                <Modal titulo='Excluir convite' textoBotao="Excluir" funcaoSalvar={() => { deletarConvite(idConviteApagado); setModoApagarConvite(!modoApagarConvite)}} enviaModal={abrirModalApagarConvite}>
                                  Tem certeza de que deseja excluir este convite?
                                </Modal>
                            }
                            { linkConvite ? 
                            <Modal enviaModal={copiarLink} titulo='Gerar convites' funcaoSalvar={copiarLink} textoBotao='Copiar Link'> O convite foi gerado! Copie o link no botão abaixo e compartilhe com o seu convidado. </Modal>
                            : 
                            ''
                            }
                    </div>
                </div>
            </div>
            </div>
    )
    }

export default Convites