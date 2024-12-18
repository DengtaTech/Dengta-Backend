import { multistream } from 'pino';
// import pinoLoki from 'pino-loki';

import { PinoLogger } from './pinoLogger.js';
const streams = [
  { stream: process.stdout },
  //   {
  //     stream: pinoLoki({
  //       batching: false,
  //       labels: { application: 'ruche-backend' },
  //       host: process.env.GRAFANA_HOST!,
  //       basicAuth: {
  //         username: process.env.GRAFANA_USERNAME!,
  //         password: process.env.GRAFANA_CLOUD_TOKEN!,
  //       },
  //     }),
  //   },
];

const logger = new PinoLogger(
  {
    enabled: process.env.LOGGING_ENABLED === 'true',
  },
  multistream(streams),
);

export default logger;
