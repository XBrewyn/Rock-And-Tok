import dotenv from 'dotenv';

dotenv.config();

import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import router from '../routers/index';
import {
  isDev,
  serveApp,
  connectToDatabase,
  initialDatabase
} from '../tools/functions';
import middlewareToken from '../middlewares/token';
import middlewareCache from '../middlewares/cache';
import middlewareImage from '../middlewares/image';

const app: Express = express();
const PORT: number = 3000;
const {
  DEV_HOST = '',
  GOOGLE_HOST = '',
  VERCEL_HOST = ''
} = process.env;

connectToDatabase().then(() => {
  initialDatabase();
});

if (isDev()) {
  app.use(cors({ origin: DEV_HOST, credentials: true }));
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", GOOGLE_HOST, VERCEL_HOST],
      styleSrc: ["'self'", GOOGLE_HOST, "'unsafe-inline'"],
      frameSrc: ["'self'", GOOGLE_HOST],
      connectSrc: ["'self'", GOOGLE_HOST, VERCEL_HOST],
      imgSrc: ["'self'", GOOGLE_HOST],
    },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewareToken);
// app.use(middlewareCache);
app.use(middlewareImage);
app.use('/api/v1', router);

isDev()
  ? app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  : serveApp(app);

export default app;
