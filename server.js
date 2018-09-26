import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import helmet from 'helmet';
import createHttpError from 'http-errors';
import dotenv from 'dotenv';

dotenv.config('.env');

import logger from './utils/logger';

import personRouter from './routes/personRouter';
import discussionRouter from './routes/discussionRouter';

const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';
const rootURL = isDev ? `http://localhost` : process.env.URL;
const mongoURL = isDev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;
const sessionSecret = process.env.SESSION_SECRET;

mongoose.connect(mongoURL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

mongoose.connection.on('error', err => logger.error(`> ${err}`));
mongoose.connection.on('connected', () => logger.info(`> Connected to MongoDB instance on ${mongoURL}`));
mongoose.connection.on('disconnected', () => logger.info(`> Disconnected from MongoDB instance on ${mongoURL}`));

const server = express();

server.set('base', rootURL);
server.use(helmet());
if (isDev) {  //Prevent memory leak, must connect to a store for production(ex. mongo)
  server.use(session({ secret: sessionSecret }))
}
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use('/person', personRouter);
server.use('/discussion', discussionRouter);

server.listen(port, err => {
  if (err) {
    logger.error(`> ${err}`);
    process.exit(1);
  }
  logger.info(`> Service running on ${rootURL} port ${port}`);
});
