import FahTelnetClient from './fahClient';
import mapToPromMetrics from './mapToPromMetrics';
import express from 'express';
import renderPromMetrics from "./renderPromMetrics";

const router = express.Router();

/* GET home page. */
router.get('/raw', async (req, res) => {
    try {
        const {target, port} = <any> req.query;
        if (typeof target !== "string" || isNaN(Number.parseInt(port))) {
            res.status(400).json({error: 'Invalid query params'});
        }
        const client = new FahTelnetClient({hostname: target, port});
        await client.connect();
        const {slotsInfo, queuesInfo, simulationInfo} = await client.fetchAllInfo();
        await client.disconnect();
        res.send({slotInfo: slotsInfo, queuesInfo, simulationInfo});
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/metrics', async (req, res) => {
    try {
        const {target, port} = <any> req.query;
        if (typeof target !== "string" || isNaN(Number.parseInt(port))) {
            res.status(400).json({error: 'Invalid query params'});
        }
        const client = new FahTelnetClient({hostname: target, port});
        await client.connect();
        const fetchedInfo = await client.fetchAllInfo();
        await client.disconnect();
        const mappedMetrics = mapToPromMetrics(fetchedInfo);
        const renderedMetrics = renderPromMetrics(mappedMetrics);
        console.log(renderedMetrics);
        res.send(renderedMetrics);
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;
