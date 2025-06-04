import cron from 'node-cron';
import ServicoDAO from '../dao/ServicoDao';

const servicoDAO = new ServicoDAO();

export function iniciarAgendadores() {
  cron.schedule('0 1 * * *', async () => {
    console.log('Executando tarefa de desativação de anúncios às 01:00');
    try {
      await servicoDAO.desativarAnunciosExpirados();
      console.log('Anúncios expirados desativados com sucesso');
    } catch (err) {
      console.error('Erro ao desativar anúncios expirados:', err);
    }
  });
}