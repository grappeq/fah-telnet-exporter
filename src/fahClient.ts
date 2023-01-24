import {Telnet, ConnectOptions, ExecOptions} from 'telnet-client';
import parsePyONMessage, {ParsedFahMessage} from './parsePyonMessage';
import {FAHInfo, QueueInfo, SimulationInfo, SlotInfo} from "./types";

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

const fetchErrorHandler = (e: Error) => {
    console.error('Failed to fetch data: ', e);
    throw new Error("Failed to fetch data from FAH server");
};

export default class FahTelnetClient {
    connectionParams: ConnectOptions;
    execParams: ExecOptions;
    connection: Telnet;

    constructor(connectionTarget?: { hostname?: string, port?: number }) {
        const hostname = !connectionTarget || connectionTarget.hostname === undefined ? DEFAULT_HOSTNAME : connectionTarget.hostname;
        const port = !connectionTarget || connectionTarget.port === undefined ? DEFAULT_PORT : connectionTarget.port;
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
            throw new Error("Failed to connect to FAH server");
        });
        console.debug('Connected to FAH telnet server');
    }

    async fetchAllInfo(): Promise<FAHInfo> {
        const {content: slotsInfo} = await this.fetchInfo(Command.SlotInfo) as ParsedFahMessage<SlotInfo[] | any>;
        const {content: queuesInfo} = await this.fetchInfo(Command.QueueInfo) as ParsedFahMessage<QueueInfo[] | any>;
        const slotIds = slotsInfo instanceof Array ? slotsInfo.map(slot => parseInt(slot.id)) : [];
        const simulationInfo = await this.fetchSimulationInfo(slotIds);
        return {slotsInfo, simulationInfo, queuesInfo};
    }

    async fetchSimulationInfo(slotIds: number[]): Promise<SimulationInfo[]> {
        const fetchPromises = slotIds
            .sort()
            .map(
                (slotId) => this.connection.exec(`${Command.SimulationInfo} ${slotId}`, this.execParams)
                    .then((response: string) => parsePyONMessage(response))
                    .then(({content}) : SimulationInfo => content as SimulationInfo)
                    .catch(fetchErrorHandler)
            );
        return Promise.all(fetchPromises)
    }

    async disconnect() {
        return this.connection.end();
    }

    async fetchInfo(command: Command): Promise<ParsedFahMessage<object>> {
        console.debug(`Fetching ${command}`);
        return await this.connection.exec(command, this.execParams)
            .then((response: string) => parsePyONMessage(response))
            .catch(fetchErrorHandler);
    };
}