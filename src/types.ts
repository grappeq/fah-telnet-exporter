export interface SlotInfo {
    'id': string,
    'status': string,
    'description': string,
    'options': object,
    'reason': string,
    'idle': boolean,
}

export interface QueueInfo {
    "id": string,
    "state": string,
    "error": string,
    "project": number,
    "run": number,
    "clone": number,
    "gen": number,
    "core": string,
    "unit": string,
    "percentdone": string,
    "eta": string,
    "ppd": string,
    "creditestimate": string,
    "waitingon": string,
    "nextattempt": string,
    "timeremaining": string,
    "totalframes": number,
    "framesdone": number,
    "assigned": string,
    "timeout": string,
    "deadline": string,
    "ws": string,
    "cs": string,
    "attempts": number,
    "slot": string,
    "tpf": string,
    "basecredit": string,
}

export interface FAHInfo {
    slotsInfo: SlotInfo[],
    queuesInfo: QueueInfo[],
    simulationInfo: object,
}

export interface SimulationInfo {
    "user": string,
    "team": string,
    "project": number,
    "run": number,
    "clone": number,
    "gen": number,
    "core_type": number,
    "core": string,
    "total_iterations": number,
    "iterations_done": number,
    "energy": number,
    "temperature": number,
    "start_time": string,
    "timeout": number,
    "deadline": number,
    "eta": number,
    "progress": number,
    "slot": number
}

export interface PrometheusLabel {
    name: string;
    value: string | number;
}

export enum PrometheusMetricType {
    COUNTER = "counter",
    GAUGE = "gauge",
    HISTOGRAM = "histogram",
    SUMMARY = "summary",
}

export interface PrometheusMetric {
    name: string;
    value: number;
    labels?: PrometheusLabel[];
    description?: string;
    type?: PrometheusMetricType;
}