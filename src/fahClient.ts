import {Telnet, ConnectOptions, ExecOptions} from 'telnet-client';
import parsePyONMessage from './parsePyonMessage';
import {hostname} from "os";

const DEFAULT_HOSTNAME = 'localhost';
const DEFAULT_PORT = 36330;
const DEFAULT_CONN_PARAMS: ConnectOptions = {
    timeout: 1500,
    shellPrompt: '> ',
    initialLFCR: true,
    ors: '\r\n',
    socketConnectOptions: {
        // @ts-ignore the upstream type definition is out of date
        autoSelectFamily: true,
    },
};

const DEFAULT_EXEC_PARAMS: ExecOptions = {
    execTimeout: 1500,
    shellPrompt: '>',
    echoLines: 0,
};

enum Command {
    SlotInfo = 'slot-info',
    SimulationInfo = 'simulation-info',
    QueueInfo = 'queue-info',
    ClientInfo = 'info',
    Uptime = 'uptime',
}

export default class FahTelnetClient {
    connectionParams: ConnectOptions;
    execParams: ExecOptions;
    connection: Telnet;

    constructor({hostname = DEFAULT_HOSTNAME, port = DEFAULT_PORT}) {
        this.connectionParams = Object.assign({}, DEFAULT_CONN_PARAMS,
            {
                host: hostname,
                port: port,
            });
        this.execParams = DEFAULT_EXEC_PARAMS;
        this.connection = new Telnet();
    }

    async connect() {
        await this.connection.connect(this.connectionParams).catch(error => {
            console.error('Failed to connect: ', error);
        });
        console.debug('Connected to FAH telnet server');
    }

    async fetchAllInfo() {
        const {content: slotInfo} = await this.fetchInfo(Command.SlotInfo);
        const {content: queueInfo} = await this.fetchInfo(Command.QueueInfo);
        const simulationInfo = await this.fetchSimulationInfo();
        return {slotInfo, simulationInfo, queueInfo};
    }

    async fetchSimulationInfo() {
        return {};
    }

    async disconnect() {
        return this.connection.end();
    }

    async fetchInfo(command: Command) {
        console.debug(`Fetching ${command}`);
        return await this.connection.exec(command, this.execParams).then((response: string) => parsePyONMessage(response)).catch((e: Error) => {
            console.error('Failed to fetch data: ', e);
            throw e;
        });
    };
}