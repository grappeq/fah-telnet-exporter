import express, {Express, Request, Response} from 'express';
import logger from 'morgan';
import indexRouter from './routes';
import {HttpRenderableError} from "./types";

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);

const errorHandler = (err: Error, req: Request, res: Response, next: CallableFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    if (err instanceof HttpRenderableError) {
        res.status(err.statusCode || 500);
        res.json({ error: err.message });
    } else {
        res.status(500);
        res.json({ error: err.message });
    }

}
app.use(errorHandler)

export default app;