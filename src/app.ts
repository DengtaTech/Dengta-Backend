import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { Database, initFixedDbData } from './Database/data-source.js';
import { initMilvus } from './Database/VectorDB/vector-db.js';
// import fakeUsers from './Test/mockData/fakeUsers.json' assert { type: 'json' };
import fakeUserCh from './Test/mockData/fakeUser-ch.json' assert { type: 'json' };
import { recommendationService } from './Infrastructure/Service/recommendationService.js';

import userRouter from './Routers/userRouter.js';
import imageRouter from './Routers/imageRouter.js';
import footprintRouter from './Routers/footprintRouter.js';
import recommendationRouter from './Routers/recommendationRouter.js';
import searchHistoryRouter from './Routers/searchHistoryRouter.js';
import { initDbCache } from './Database/Cache/init.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
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

async function usingMilvusExample() {
  for (const user of fakeUserCh) {
    await recommendationService.addUserDataToMilvus(user, 3);
  }
}

try {
  await Database.initialize();
  await initFixedDbData();
  initDbCache();
  console.log('all database initialized successfully');
  await Promise.all([
    usingRedisExample(),
    (async () => {
      await initMilvus(true);
      await usingMilvusExample();
      console.log('Milvus initialized successfully');
    })(),
  ]);
} catch (err) {
  console.error('Failed to initialize the database:', err);
}

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

export default app; // Export for testing
