import { DataSource } from "typeorm";
import { User } from "./Entities/user.js";
import { Footprint } from "./Entities/footprint.js";
import { UserCredential } from "./Entities/userCredential.js";
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_HOST = process.env.TS_MYSQL_HOST;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

console.log(MYSQL_HOST);
export const Database = new DataSource({
    type: "mysql",
    host: MYSQL_HOST,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    synchronize: true,
    entities: [
        User,
        Footprint,
        UserCredential
    ],
  })