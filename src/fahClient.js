import {Telnet} from 'telnet-client';
import parsePyONMessage from './parsePyonMessage.js';

// these parameters are just examples and most probably won't work for your use-case.
const DEFAULT_CONN_PARAMS = {
  host: 'localhost',
  port: 36330,
  timeout: 1500,
  shellPrompt: '> ',
  initialLFCR: true,
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
  constructor({hostname: host, port}) {
    this.connectionParams = Object.assign({}, DEFAULT_CONN_PARAMS,
        {host, port});
    this.execParams = DEFAULT_EXEC_PARAMS;
  }

  async connect() {
    this.connection = new Telnet();
    await this.connection.connect(this.connectionParams, error => {
      console.log('Failed to connect: ', error);
    });
    console.log('Connected to FAH telnet server');
  }

  async fetchAllInfo() {
    const {content: slotInfo} = await this.fetchInfo(this.connection,
        COMMANDS.SLOT_INFO);
    const {content: simulationInfo} = await this.fetchInfo(this.connection,
        COMMANDS.SIMULATION_INFO);
    const {content: queueInfo} = await this.fetchInfo(this.connection,
        COMMANDS.QUEUE_INFO);
    return {slotInfo, simulationInfo, queueInfo};
  }

  async disconnect() {
    return this.connection.end();
  }

  async fetchInfo(connection, command) {
    return connection.exec(command, DEFAULT_EXEC_PARAMS).
        then((response) => parsePyONMessage(response));
  };

}

