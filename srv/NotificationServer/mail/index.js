const MailService = require('./mailService');
const RabbitmqService = require('./rabbitmqService');

async function startApp() {
  const rabbitmqService = new RabbitmqService(new MailService());
  await rabbitmqService.init();
}

startApp();
