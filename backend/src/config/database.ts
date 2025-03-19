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
    await sequelize.models.Tipo.findOrCreate({
        where:{
            idTipo: 1
        }, 
        defaults:{
            nomeTipo: 'Organizador de Eventos',
            descricaoTipo: 'Responsável pela coordenação e planejamento de eventos sociais.'
        }
    });
    await sequelize.models.Tipo.findOrCreate({
        where:{
            idTipo: 2
        }, 
        defaults:{
            nomeTipo: 'Prestador de Serviços',
            descricaoTipo: 'Responsável por prestar serviços.'
        }
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