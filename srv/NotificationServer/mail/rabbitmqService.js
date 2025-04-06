import amqp from 'amqplib';
import { sendStrategies } from './utils/sendStrategies.js';
export default class RabbitmqService {
  constructor(mailService) {
    this.mailService = mailService;
    this.mqUrl = process.env.MQ_URL;
    this.queueName = 'EMAIL';

    this.connection = null;
    this.channel = null;
  }

  async init() {
    try {
      this.connection = await amqp.connect(this.mqUrl);
      this.channel = await this.connection.createChannel();

      // 宣告 queue（若已存在，不會重複創建）
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log(
        `[RabbitmqService] Connected to ${this.mqUrl}, queue: ${this.queueName}`,
      );
      // 若希望一次只處理一筆訊息，避免併發寄信，可加:
      // this.channel.prefetch(1);
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
            const data = JSON.parse(content);

            await this.handleEmailMessage(data);

            this.channel.ack(msg);
          } catch (error) {
            console.error('[RabbitmqService] Error processing message:', error);
            // 根據需求決定是否要重試或退給 dead-letter
            // TODO: 可以先在這做監控 alert 就好
            this.channel.nack(msg, false, false);
          }
        }
      },
      {
        noAck: false,
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
    const strategy = sendStrategies[element.type];

    if (strategy) {
      await strategy(this.mailService, element);
    } else {
      console.warn(
        '[RabbitmqService] No strategy found for type:',
        element.type,
      );
    }
  }
}
