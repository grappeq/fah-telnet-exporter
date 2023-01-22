import express, {Express} from 'express';
import logger from 'morgan';
import indexRouter from './routes';

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);

export default app;