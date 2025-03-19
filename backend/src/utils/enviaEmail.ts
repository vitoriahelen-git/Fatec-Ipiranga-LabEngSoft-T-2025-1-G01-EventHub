import transportador from "../config/email"

const {
    EMAIL_HOST,
    URL_FRONTEND
} = process.env;

const enviarEmailRecuperacaoSenha = async (email: string, nomeDestinatario: string, token: string) => {
    await transportador.sendMail({
        from: `EventHub <${EMAIL_HOST}>`,
        to: `${nomeDestinatario} <${email}>`,
        subject: 'Redefinição de Senha - EventHub',
        html: `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Redefinição de Senha</title>
                <style>
                    body{
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #ececec;
                    }
                    .container{
                        background-color: #ffffff;
                        border-radius: 16px;
                        width: 500px;
                        margin: 10px auto;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                    }
                    .cabecalho{
                        background-color: #8C5DFF;
                        padding: 30px;
                        border-radius: 16px 16px 0 0;
                        color: white;
                        text-align: center;
                    }
                    h1{
                        margin: 0;
                        font-size: 24px;
                        font-weight: 400;
                    }
                    .corpo{
                        padding: 30px 20px;
                        text-align: center;
                        line-height: 1.5;
                    }
                    .corpo p{
                        text-align: left;
                    }
                    .corpo p:first-child{
                        margin-top: 0;
                    }
                    .container-botao{
                        color: white;
                    }
                    .botao{
                        margin-top: 10px;
                        background-color: #8C5DFF;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 8px;
                        text-decoration: none;
                        display: inline-block;
                    }
                    .botao:hover{
                        background-color: #6A40C3;
                    }
                    .rodape{
                        background-color: #7832d4;
                        padding: 10px;
                        border-radius: 0 0 16px 16px;
                        color: #ffffff;
                        text-align: center;
                    }
                    .rodape p{
                        margin: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="cabecalho">
                        <h1>EventHub - Redefinição de Senha</h1>
                    </div>
                    <div class="corpo">
                        <p>Olá, ${nomeDestinatario}.</p>
                        <p>Recebemos uma solicitação de redefinição de senha da sua conta do EventHub. Clique no botão abaixo para redefinir:</p>
                        <div class="container-botao">
                            <a href="${URL_FRONTEND}/redefinir-senha?token=${token}" target="_blank" style="color: #ffffff;" class="botao">Redefinir</a>
                        </div>
                    </div>
                    <div class="rodape">
                        <p>&copy; ${new Date().getFullYear()} | EventHub</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Olá, ${nomeDestinatario}. Recebemos uma solicitação de redefinição de senha da sua conta do EventHub. Acesse o link para redefinir: ${URL_FRONTEND}/redefinir-senha?token=${token}`
    });
}

export default enviarEmailRecuperacaoSenha;