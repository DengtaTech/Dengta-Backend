import MailService from './mailService.js';
import RabbitmqService from './rabbitmqService.js';

async function startApp() {
  const mailService = new MailService();
  const rabbitmqService = new RabbitmqService(mailService);

  await rabbitmqService.init();
}

startApp();
