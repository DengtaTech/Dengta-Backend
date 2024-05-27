import express, { Request, Response } from 'express';
import "reflect-metadata";
import { Database } from './Database/data-source.js';
import userRouter from './Routers/userRouter.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/1.0/user', userRouter);

app.get('/api/1.0/health', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});



Database.initialize().then(() => {
    console.log("Database initialized successfully");
    app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
}).catch(err => {
    console.error("Failed to initialize the database:", err);
});

export default app; // Export for testing