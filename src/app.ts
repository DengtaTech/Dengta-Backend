import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { Database } from './Database/data-source.js';
import userRouter from './Routers/userRouter.js';
import { initDbCache } from './Database/Cache/init.js';
// using redis example
import { User as CacheUser } from './Database/Cache/Entities/user.js';

const app = express();
const port = process.env.EXPRESS_PORT;

app.use(express.json());
app.use('/api/1.0/user', userRouter);

app.get('/api/1.0/health', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

async function usingRedisExample() {
  console.log('test');
  await CacheUser.setById(1, {
    id: 1,
    name: 'Dengta',
    lifeRole: '小可爱',
    avatar: 'https://avatars.githubusercontent.com/u/101214613?v=4',
    selfIntro: '小可爱的小可爱'
  });
  const cache = await CacheUser.getById(1);
  if (cache !== undefined) {
    console.log(cache);
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
