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

const app: Express = express();
const PORT: number = 3000;
const { DEV_HOST } = process.env;

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
      scriptSrc: ["'self'", "https://accounts.google.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],  // Allow embedding Google content
      connectSrc: ["'self'", "https://accounts.google.com"], // Allow API requests to Google
      imgSrc: ["'self'", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],  // If inline styles are needed
    },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewareToken);
app.use(middlewareCache);

app.use('/api/v1', router);

isDev()
  ? app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  : serveApp(app);

export default app;
