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
    Auth = 'auth',
}

const fetchErrorHandler = (e: Error) => {
    console.error('Failed to fetch data: ', e);
    throw new Error("Failed to fetch data from FAH server");
};

export default class FahTelnetClient {
    connectionParams: ConnectOptions;
    execParams: ExecOptions;
    connection: Telnet;
    authPassword?: string;

    constructor(connectionTarget?: { hostname?: string, port?: number }, fahAuthPassword?: string) {
        const hostname = !connectionTarget || connectionTarget.hostname === undefined ? DEFAULT_HOSTNAME : connectionTarget.hostname;
        const port = !connectionTarget || connectionTarget.port === undefined ? DEFAULT_PORT : connectionTarget.port;
        this.connectionParams = Object.assign({}, DEFAULT_CONN_PARAMS,
            {
                host: hostname,
                port: port,
            });
        this.execParams = DEFAULT_EXEC_PARAMS;
        this.connection = new Telnet();
        this.authPassword = fahAuthPassword;

        this.fetchSimulationInfo = this.fetchSimulationInfo.bind(this);
    }

    async connect() {
        await this.connection.connect(this.connectionParams).catch(error => {
            console.error('Failed to connect: ', error);
            throw new Error("Failed to connect to FAH server");
        });
        console.debug('Connected to FAH telnet server');
        if(this.authPassword) {
            console.debug('Authenticating');
            await this.execAuth();
            console.debug('Authentication successful');
        }

    }

    async fetchAllInfo(): Promise<FAHInfo> {
        const {content: slotsInfo} = await this.fetchInfo(Command.SlotInfo) as ParsedFahMessage<SlotInfo[] | any>;
        const {content: queuesInfo} = await this.fetchInfo(Command.QueueInfo) as ParsedFahMessage<QueueInfo[] | any>;
        const slotIds = slotsInfo instanceof Array ? slotsInfo.map(slot => parseInt(slot.id)) : [];
        slotIds.sort();
        const simulationInfo = await this.fetchAllSimulationInfo(slotIds);
        return {slotsInfo, simulationInfo, queuesInfo};
    }

    async execAuth(): Promise<void> {
        return this.connection.exec(`${Command.Auth} ${this.authPassword}`, this.execParams)
            .then((response: string) => {
                if (response.trim() !== 'OK') {
                    throw new Error(`Failed to authenticate to F@H server: ${response}`);
                }
            });
    }

    async fetchAllSimulationInfo(slotIds: number[]): Promise<SimulationInfo[]> {
        const simulationInfos = [];
        // it is important to execute commands sequentially so they don't interfere with each other
        for (const slotId of slotIds) {
            const simulationInfo = await this.fetchSimulationInfo(slotId);
            simulationInfos.push(simulationInfo);
        }
        return simulationInfos;
    }

    async fetchSimulationInfo(slotId: number): Promise<SimulationInfo> {
        console.debug(`Fetching simulation-info for slot: ${slotId}`);
        return await this.connection.exec(`${Command.SimulationInfo} ${slotId}`, this.execParams)
            .then((response: string) => parsePyONMessage(response))
            .then(({content}) : SimulationInfo => content as SimulationInfo)
            .catch(fetchErrorHandler)
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