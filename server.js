import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import createHttpError from 'http-errors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config('.env');

import logger from './utils/logger';
import { connect } from './utils/database';

import personRouter from './routes/personRouter';
import discussionRouter from './routes/discussionRouter';

const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';
const rootURL = isDev ? `http://localhost` : process.env.URL;
const mongoURL = isDev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;
const mongoDatabase = process.env.MONGO_DB_NAME;
const sessionSecret = process.env.SESSION_SECRET;

connect(mongoURL, mongoDatabase)
  .then(db => {
    const server = express();

    server.locals.db = db;

    server.set('base', rootURL);
    server.use(helmet());
    if (isDev) {  //Prevent memory leak, must connect to a store for production(ex. mongo)
      server.use(session({ 
        secret: sessionSecret,
        resave: true,
        saveUninitialized: true
      }))
    }
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));

    server.use('/people', personRouter);
    server.use('/discussions', discussionRouter);

    server.listen(port, err => {
      if (err) {
        logger.error(`> ${err}`);
        process.exit(1);
      }
      logger.info(`> Service running on ${rootURL} port ${port}`);
    });
  })
  .catch(err => {
    logger.error(`> Cannot find database. Aborting`);
    process.end(1);
  });
