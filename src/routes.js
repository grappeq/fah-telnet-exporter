import FahTelnetClient from './fahClient.js';
import mapToPromMetrics from './mapToPromMetrics.js';
import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/raw', async (req, res) => {
  try {
    const {target, port} = req.query;
    const client = new FahTelnetClient({hostname: target, port});
    await client.connect();
    const {slotInfo, queueInfo, simulationInfo} = await client.fetchAllInfo();
    await client.disconnect();
    res.send({slotInfo, queueInfo, simulationInfo});
  } catch (e) {
    res.status(500, e);
  }
});

router.get('/metrics', async (req, res) => {
  try {
    const {target, port} = req.params;
    const client = new FahTelnetClient({hostname: target, port});
    await client.connect();
    const fetchedInfo = await client.fetchAllInfo();
    await client.disconnect();
    res.send(mapToPromMetrics(fetchedInfo));
  } catch (e) {
    res.status(500, e);
  }
});

export default router;
