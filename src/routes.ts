import FahTelnetClient from './fahClient';
import mapToPromMetrics from './mapToPromMetrics';
import express, {Request, Response} from 'express';
import renderPromMetrics from "./renderPromMetrics";
import {FAHInfo} from "./types";
import config from './config';

const router = express.Router();

const DEFAULT_PORT = 36330;

const {fahAuthPassword} = config;

const handleFetchingMetrics = async (req: Request, res: Response) : Promise<FAHInfo> => {
    const {target} = <any> req.query;
    const providedPort = parseInt(req.query.port as string);
    if (typeof req.query.target !== "string" || (!!req.query.port && isNaN(providedPort))) {
        res.status(400).json({error: 'Invalid query params'});
        throw {status: 400, message: 'Invalid query params'};
    }
    const password = <string>(req.query.password !== undefined ? req.query.password : fahAuthPassword);
    const client = new FahTelnetClient({hostname: target, port: providedPort || DEFAULT_PORT}, password);
    await client.connect();
    const fetchedInfo = await client.fetchAllInfo();
    await client.disconnect();
    return fetchedInfo;
}

/* GET home page. */
router.get('/raw', async (req, res, next) => {
    try {
        const fetchedInfo = await handleFetchingMetrics(req, res);
        res.json(fetchedInfo);
    } catch (e) {
        next(e);
    }
});

router.get('/metrics', async (req, res, next) => {
    try {
        const fetchedInfo = await handleFetchingMetrics(req, res);
        const mappedMetrics = mapToPromMetrics(fetchedInfo);
        const renderedMetrics = renderPromMetrics(mappedMetrics, config.metricPrefix);
        res.send(renderedMetrics);
    } catch (e) {
        next(e);
    }
});

export default router;
