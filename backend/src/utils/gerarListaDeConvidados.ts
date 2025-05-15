import Convidado from "../models/Convidado";
import Evento from "../models/Evento";
import puppeteer from 'puppeteer';

const { URL_BACKEND, SERVER_PORT } = process.env;

const gerarListaDeConvidados = async (evento: Evento, convidados: Convidado[]) => {
    const htmlLista = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de convidados | EventHub</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
            <style>
                *{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: "Inter", sans-serif;
                }

                body{
                    min-height: calc(100vh - 32px);
                    border: 2px solid #8C5DFF;
                    margin: 16px;
                    padding: 24px;
                }

                .container-informacoes{
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .container-informacoes-evento{
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .logo-eventhub{
                    width: 200px;
                }

                h1{
                    font-weight: 300;
                    font-size: 36px;
                }

                .informacoes-evento{
                    text-align: center;
                }

                .nome-evento{
                    font-size: 22px;
                    font-weight: 500;
                }

                .data-evento{
                    font-size: 16px;
                    font-weight: 500;
                    color: #8C5DFF;
                }

                .container-separador{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }

                .separador{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 500px;
                }

                .separador__quadrado{
                    border: 2px solid #8C5DFF;
                    width: 12px;
                    height: 12px;
                    display: inline-block;
                }

                .separador__linha{
                    background-color: #8C5DFF;
                    width: 100%;
                    height: 2px;
                    display: inline-block;
                }

                .tabela-convidados{
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }

                .tabela-convidados th{
                    border-top: 1px solid #6A40C3;
                    border-bottom: 1px solid #6A40C3;
                    background-color: #8C5DFF;
                    color: #FFF;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                }
                
                .tabela-convidados tr:nth-child(even){
                    background-color: #F2F2F2;
                }
                
                .tabela-convidados th,
                .tabela-convidados td{
                    padding: 12px 16px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container-informacoes">
                <img src="${URL_BACKEND}:${SERVER_PORT}/logo_eventhub.png" alt="Logo EventHub" class="logo-eventhub">
                <h1>Lista de convidados</h1>
                <div class="container-informacoes-evento">
                    <div class="container-separador">
                        <div class="separador">
                            <span class="separador__quadrado"></span>
                            <span class="separador__linha"></span>
                            <span class="separador__quadrado"></span>
                        </div>
                    </div>
                    <div class="informacoes-evento">
                        <h2 class="nome-evento">${evento.nomeEvento}</h2>
                        <span class="data-evento">${evento.dataEvento.toString().split('T')[0].split('-').reverse().join('.')}</span>
                    </div>
                    <div class="container-separador">
                        <div class="separador">
                            <span class="separador__quadrado"></span>
                            <span class="separador__linha"></span>
                            <span class="separador__quadrado"></span>
                        </div>
                    </div>
                </div>
            </div>
            <table class="tabela-convidados">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Data de nascimento</th>
                        <th>RG</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                        convidados.map((convidado, index) => (`
                            <tr>
                                <td>${index + 1}</td>
                                <td>${convidado.nome}</td>
                                <td>${convidado.email}</td>
                                <td>${convidado.dataNascimento.toString().split('T')[0].split('-').reverse().join('/')}</td>
                                <td>${`${convidado.rg.slice(0, 2)}.${convidado.rg.slice(2, 5)}.${convidado.rg.slice(5, 8)}-${convidado.rg.slice(8)}`}</td>
                            </tr>
                        `)).join('')
                    }
                </tbody>
            </table>
        </body>
        </html>
    `;

    const navegador = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const pagina = await navegador.newPage();
    await pagina.setContent(htmlLista, { waitUntil: 'networkidle0' });

    const pdf = await pagina.pdf({
        format: 'A4',
        printBackground: true
    })
    await navegador.close();

    return pdf;
}

export default gerarListaDeConvidados;