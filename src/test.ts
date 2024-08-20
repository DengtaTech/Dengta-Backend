import { Database } from './Database/data-source.js';
import { userRepo } from './Infrastructure/Repository/userRepo.js';

await Database.initialize();

const user = await userRepo.findById('0d55f789-1791-4926-84f4-4ac14eb51598');

console.log(user);
await Database.destroy();
