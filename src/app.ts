import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { Database, initFixedDbData } from './Database/data-source.js';
import { initMilvus } from './Database/VectorDB/vector-db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
// import fakeUsers from './Test/mockData/fakeUsers.json' assert { type: 'json' };
// import fakeUserCh from './Test/mockData/fakeUser-ch.json' assert { type: "json" };
const fakeUserCh = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './Test/mockData/fakeUser-ch.json'),
    'utf8',
  ),
);

import { recommendationService } from './Infrastructure/Service/recommendationService.js';

import userRouter from './Routers/userRouter.js';
import imageRouter from './Routers/imageRouter.js';
import footprintRouter from './Routers/footprintRouter.js';
import recommendationRouter from './Routers/recommendationRouter.js';
import searchHistoryRouter from './Routers/searchHistoryRouter.js';
import notificationRouter from './Routers/notificationRouter.js';
import questionItemRouter from './Routers/questionItemRouter.js';
import volumeRouter from './Routers/volumeRouter.js';
import { initDbCache } from './Database/Cache/init.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

// using redis example
import { User as CacheUser } from './Database/Cache/Entities/user.js';
import { errorHandler } from './Middlewares/errorHandler.js';
import { multerErrorHandling } from './Middlewares/multer.js';

const app = express();
const port = process.env.EXPRESS_PORT;

app.use(express.json());
app.use('/image', imageRouter);
app.use('/api/1.0/user', userRouter);
app.use('/api/1.0/recommendation', recommendationRouter);
app.use('/api/1.0/search', searchHistoryRouter);
app.use('/api/1.0/footprint', footprintRouter);
app.use('/api/1.0/notification', notificationRouter);
app.use('/api/1.0/question', questionItemRouter);
app.use('/api/1.0/volume', volumeRouter);

app.get('/api/1.0/health', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.use(multerErrorHandling);
app.use(errorHandler);

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function usingRedisExample() {
  await CacheUser.setById(1, {
    id: 1,
    name: 'Dengta',
    lifeRole: '小可爱',
    avatar: 'https://avatars.githubusercontent.com/u/101214613?v=4',
    selfIntro: '小可爱的小可爱',
  });
  const cache = await CacheUser.getById(1);
  if (cache !== undefined) {
    console.log('Redis is working');
  }
}

if (process.env.NODE_ENV !== 'test') {
  try {
    await Database.initialize();
  } catch (err) {
    console.error('Failed to initialize the database:', err);
  }

  await initFixedDbData();
  initDbCache();
  console.log('all database initialized successfully');
  await Promise.all([
    usingRedisExample(),
    (async () => {
      console.log('test');
      await initMilvus(true);
      console.log('Milvus initialized successfully');
    })(),
  ]);

  app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
}

export default app; // Export for testing
