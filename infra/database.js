import { Client } from "pg";

async function query(queryObject) {
  const client = new Client(connectionObj);
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}
const connectionObj = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  ssl: process.env.NODE_ENV === "development" ? false : true,
};
export default {
  query: query,
};
