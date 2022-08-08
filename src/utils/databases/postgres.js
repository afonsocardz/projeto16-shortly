import pg from 'pg';
import pgConnection from 'pg-connection-string';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = pgConnection.parse(process.env.DATABASE_URL);
console.log(connectionString);

const {Pool} = pg;

const connection = new Pool({
  ...connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

export default connection;