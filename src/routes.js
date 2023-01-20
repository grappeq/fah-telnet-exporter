import FahTelnetClient from './fahClient.js';
import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const client = new FahTelnetClient();
    await client.connect();
    const {slotInfo,queueInfo,simulationInfo} = await client.fetchAllInfo();
    await client.disconnect();
    res.send({slotInfo,queueInfo,simulationInfo});
  } catch (e) {
    res.status(500, e);
  }
});

export default router;
