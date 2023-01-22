import {Telnet} from 'telnet-client';
import parsePyONMessage from './parsePyonMessage.js';

const DEFAULT_HOSTNAME = 'localhost';
const DEFAULT_PORT = 36330;
const DEFAULT_CONN_PARAMS = {
  timeout: 1500,
  shellPrompt: '> ',
  initialLFCR: true,
  ors: '\r\n',
  socketConnectOptions: {
    autoSelectFamily: true,
  },
};

const DEFAULT_EXEC_PARAMS = {
  timeout: 1500,
  execTimeout: 1500,
  shellPrompt: '>',
  echoLines: 0,
};

const COMMANDS = Object.freeze({
  SLOT_INFO: 'slot-info',
  SIMULATION_INFO: 'simulation-info',
  QUEUE_INFO: 'queue-info',
  CLIENT_INFO: 'info',
  UPTIME: 'uptime',
});

export default class FahTelnetClient {
  constructor({hostname, port} = {}) {
    this.connectionParams = Object.assign({}, DEFAULT_CONN_PARAMS,
        {
          host: hostname || DEFAULT_HOSTNAME,
          port: port || DEFAULT_PORT,
        });
    this.execParams = DEFAULT_EXEC_PARAMS;
  }

  async connect() {
    this.connection = new Telnet();
    await this.connection.connect(this.connectionParams, error => {
      console.error('Failed to connect: ', error);
    });
    console.debug('Connected to FAH telnet server');
  }

  async fetchAllInfo() {
    const {content: slotInfo} = await this.fetchInfo(this.connection,
        COMMANDS.SLOT_INFO);
    const {content: queueInfo} = await this.fetchInfo(this.connection,
        COMMANDS.QUEUE_INFO);
    const simulationInfo = await this.fetchSimulationInfo();
    return {slotInfo, simulationInfo, queueInfo};
  }

  async fetchSimulationInfo() {
    return {};
  }

  async disconnect() {
    return this.connection.end();
  }

  async fetchInfo(connection, command) {
    console.debug(`Fetching ${command}`);
    return await connection.exec(command, this.execParams).
        then((response) => parsePyONMessage(response)).catch((e) => {
          console.error('Failed to fetch data: ', e);
          throw e;
        });
  };
}