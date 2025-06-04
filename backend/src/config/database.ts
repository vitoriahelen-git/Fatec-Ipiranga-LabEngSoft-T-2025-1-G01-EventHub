import 'dotenv/config'
import { Sequelize } from 'sequelize';

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DATABASE,
    DB_PORT
} = process.env;

const sequelize = new Sequelize(DB_DATABASE!, DB_USER!, DB_PASSWORD!, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

const inicializarComDados = async () => {
    const tiposDeUsuario = [
        {
            nomeTipo: 'Organizador de Eventos',
            descricaoTipo: 'Responsável pela coordenação e planejamento de eventos sociais.'
        },
        {
            nomeTipo: 'Prestador de Serviços',
            descricaoTipo: 'Responsável por prestar serviços.'
        }
    ];

    const tiposDeEvento = [
        "Aula", "Apresentação", "Casamento", "Celebração", "Cerimônia", "Comemoração", "Competição", 
        "Conferência", "Encontro", "Evento acadêmico", "Evento corporativo", "Evento cultural", 
        "Evento esportivo", "Evento religioso", "Exposição", "Feira", "Festival", "Festa", 
        "Lançamento", "Palestra", "Reunião", "Seminário", "Show", "Treinamento", "Workshop"
    ];

    const tiposDeServicos = [
        "Alimentação", "Audiovisual", "Decoração", "Fotografia", "Locação de Espaço", 
        "Música", "Segurança", "Transporte", "Iluminação", "Limpeza", "Recepção",
        "Sonorização", "Buffet", "Cerimonial", "Coquetel", "DJ", "Espaço para Eventos"
    ];

    tiposDeUsuario.map(async (tipo, index) => {
        await sequelize.models.Tipo.findOrCreate({
            where:{
                idTipo: index + 1
            }, 
            defaults:{
                nomeTipo: tipo.nomeTipo,
                descricaoTipo: tipo.descricaoTipo
            }
        });
    });

    tiposDeEvento.map(async (tipo, index) => {
        await sequelize.models.TipoEvento.findOrCreate({
            where:{
                idTipoEvento: index + 1
            }, 
            defaults:{
                descricaoTipoEvento: tipo
            }
        });
    });

    tiposDeServicos.map(async (tipo, index) => {
        await sequelize.models.TipoServico.findOrCreate({
            where:{
                idTipoServico: index + 1
            }, 
            defaults:{
                descricaoTipoServico: tipo
            }
        });
    });
}

const sincronizarBanco = async () => {
    try {
        await sequelize.sync(); 
        await inicializarComDados();
        console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('Erro ao sincronizar modelos:', error);
    }
}

export { 
    sequelize, 
    sincronizarBanco 
};