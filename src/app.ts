import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { Database } from './Database/data-source.js';
import userRouter from './Routers/userRouter.js';
import searchHistoryRouter from './Routers/searchHistoryRouter.js';
import { initDbCache } from './Database/Cache/init.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

// using redis example
import { User as CacheUser } from './Database/Cache/Entities/user.js';
import { errorHandler } from './Middlewares/errorHandler.js';

const app = express();
const port = process.env.EXPRESS_PORT;

app.use(express.json());
app.use('/api/1.0/user', userRouter);
app.use('/api/1.0/search', searchHistoryRouter);

app.get('/api/1.0/health', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

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

Database.initialize()
  .then(() => {
    initDbCache();
    console.log('all database initialized successfully');
    usingRedisExample();
    app.listen(port, () => {
      console.log(`App listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize the database:', err);
  });

export default app; // Export for testing
