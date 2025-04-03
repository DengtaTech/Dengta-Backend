const amqp = require('amqplib');

class RabbitmqService {
  constructor(mailService) {
    this.mailService = mailService;
    this.mqUrl = process.env.MQ_URL;
    this.queueName = 'EMAIL';
    this.notifyType = [
      'system',
      'is_followed',
      'follower_footprint',
      'footprint_reaction',
    ];
    this.connection = null;
    this.channel = null;
  }

  async init() {
    try {
      this.connection = await amqp.connect(this.mqUrl);
      this.channel = await this.connection.createChannel();

      // 宣告 queue（若已存在，不會重複創建，queue 在 RabbitMQ node 的持久化
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log(
        `[RabbitmqService] Connected to ${this.mqUrl}, queue: ${this.queueName}`,
      );

      this.consumeMessages();
    } catch (error) {
      console.error('[RabbitmqService] Error initializing:', error);
      throw error;
    }
  }

  consumeMessages() {
    if (!this.channel) {
      console.error('[RabbitmqService] channel not found');
      return;
    }
    this.channel.consume(
      this.queueName,
      async (msg) => {
        if (msg !== null) {
          try {
            const content = msg.content.toString();
            console.log('[RabbitmqService] Received message =>', content);
            const data = JSON.parse(content);

            await this.handleEmailMessage(data);

            this.channel.ack(msg);
          } catch (error) {
            console.error('[RabbitmqService] Error processing message:', error);
            // 根據需求決定是否要重試或退給 dead-letter
            // 此處範例是放棄處理 (nack, 不重新入列)
            this.channel.nack(msg, false, false);
          }
        }
      },
      {
        noAck: false, // manual acknowledgment mode,
      },
    );
  }
  // 不可並行寄信 -> Gmail API rate limit
  async handleEmailMessage(data) {
    if (Array.isArray(data)) {
      for (const element of data) {
        await this.sendEmailByElement(element);
      }
    } else {
      await this.sendEmailByElement(data);
    }
  }

  async sendEmailByElement(element) {
    if (element.type === this.notifyType[1]) {
      await this.mailService.sendMail({
        from: `"DengTa" <${process.env.GMAIL_ACCOUNT}>`,
        to: element.email,
        subject: element.title,
        text: `${element.content}.\n` + `第二行測試`,
      });
    }
  }
}

module.exports = RabbitmqService;
