import { MongoClient } from 'mongodb';

import logger from './logger';

export const connect = async (url, dbName) => {
  
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    logger.info(`> Connected to MongoDB instace on ${url}`);

    return await client.db(dbName);
  } catch(err) {
    logger.error(`> Cannot connect to mongodb instance. Aborting`);
    process.end(1);
  }
}

