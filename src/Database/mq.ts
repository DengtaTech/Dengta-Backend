import amqplib, { ChannelModel, Channel } from 'amqplib';
import logger from './Logger/index.js';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;
let isReconnecting = false;

const MQ_URL = process.env.RABBITMQ_URL as string;

export async function initMQ(): Promise<void> {
  try {
    if (connection && channel) {
      logger.info('RabbitMQ: already connected');
      return;
    }
    connection = await amqplib.connect(MQ_URL);
    channel = await connection.createChannel();
    // TODO: haven't set socket way
    await channel.assertQueue('EMAIL', { durable: true });

    logger.info(`RabbitMQ connected and channel ready. Queue: EMAIL`);

    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed, will attempt to reconnect...');
      channel = null;
      connection = null;
      reconnect();
    });
  } catch (error) {
    logger.error(error, 'Error initializing RabbitMQ');
    throw error;
  }
}

async function reconnect() {
  if (isReconnecting) {
    return;
  }
  isReconnecting = true;

  let retries = 0;
  const maxRetries = 5;

  while (!connection && retries < maxRetries) {
    try {
      logger.info(`Reconnecting... Attempt #${retries + 1}`);
      await initMQ();
      break;
    } catch (err) {
      retries++;
      const delay = 2000 * retries;
      logger.warn(`Reconnection failed, retrying in ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  if (!connection) {
    logger.error(
      'Max reconnection attempts reached. Please check RabbitMQ status.',
    );
  }

  isReconnecting = false;
}

export function sendToNotificationServer(notifications: string) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  try {
    channel.sendToQueue('EMAIL', Buffer.from(notifications), {
      persistent: true,
    });
    logger.info(`Published to queue successfully`);
  } catch (err) {
    logger.error(err, 'Publish error');
  }
}
