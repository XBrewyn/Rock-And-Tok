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

const app: Express = express();
const PORT: number = 3000;
const { DEV_HOST } = process.env;

connectToDatabase().then(() => {
  initialDatabase();
});

if (isDev()) {
  app.use(cors({ origin: DEV_HOST, credentials: true }));
}

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewareToken);

app.use('/api/v1', router);

isDev()
  ? app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  : serveApp(app);

export default app;
