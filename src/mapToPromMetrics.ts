import {FAHInfo, PrometheusMetric, PrometheusMetricType, QueueInfo, SimulationInfo, SlotInfo} from './types';

const LABELS = {
    SLOT: 'slot',
    STATUS: 'status',
    STATE: 'state',
    QUEUE: 'queue',
    WORK_UNIT: 'work_unit',
    WORK_UNIT_RUN: 'work_unit_run',
    WORK_UNIT_CLONE: 'work_unit_clone',
    WORK_UNIT_GEN: 'work_unit_gen',
    WORK_UNIT_PROJECT: 'work_unit_project',
    USER: 'user',
    TEAM: 'team',
};

const mapSlotsInfo = (slots: SlotInfo[]): PrometheusMetric[] => slots.map((slot) => [
    {
        name: 'slot_idle',
        value: slot.idle ? 1 : 0,
        type: PrometheusMetricType.GAUGE,
        labels: [
            {name: LABELS.SLOT, value: parseInt(slot.id)},
        ]
    },
    {
        name: 'slot_running',
        value: slot.status === 'RUNNING' ? 1 : 0,
        type: PrometheusMetricType.GAUGE,
        labels: [
            {name: LABELS.SLOT, value: parseInt(slot.id)},
        ]
    },
    {
        name: 'slot_status',
        value: 1,
        labels: [
            {name: LABELS.SLOT, value: parseInt(slot.id)},
            {name: LABELS.STATUS, value: slot.status},
        ]
    }
]).flat(1);

const mapQueuesInfo = (queues: QueueInfo[]): PrometheusMetric[] => queues.map((queue) => {
    const labels = [
        {name: LABELS.QUEUE, value: queue.id},
        {name: LABELS.SLOT, value: parseInt(queue.slot)},
        {name: LABELS.WORK_UNIT_PROJECT, value: queue.project},
        {name: LABELS.WORK_UNIT_CLONE, value: queue.clone},
        {name: LABELS.WORK_UNIT_RUN, value: queue.run},
        {name: LABELS.WORK_UNIT_GEN, value: queue.gen},
        {name: LABELS.WORK_UNIT, value: `${queue.project}(${queue.run},${queue.clone},${queue.gen})`},
    ];
    return [
        {
            name: 'queue_project',
            value: queue.project,
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_percent_done',
            value: parseFloat(queue.percentdone),
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_points_per_day',
            value: parseInt(queue.ppd),
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_credit_estimate',
            value: parseInt(queue.creditestimate),
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_credit_base',
            value: parseInt(queue.basecredit),
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_frames_total',
            value: queue.totalframes,
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_frames_done',
            value: queue.framesdone,
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_eta_days',
            value: parseFloat(queue.eta),
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'queue_state',
            value: 1,
            type: PrometheusMetricType.GAUGE,
            labels: [
                ...labels,
                {name: LABELS.STATE, value: queue.state},
            ],
        },
    ];
}).flat(1);


const mapSimulationInfo = (simulations: SimulationInfo[]): PrometheusMetric[] => simulations.map((sim) => {
    const labels = [
        {name: LABELS.SLOT, value: sim.slot},
        {name: LABELS.WORK_UNIT_PROJECT, value: sim.project},
        {name: LABELS.WORK_UNIT_CLONE, value: sim.clone},
        {name: LABELS.WORK_UNIT_RUN, value: sim.run},
        {name: LABELS.WORK_UNIT_GEN, value: sim.gen},
        {name: LABELS.USER, value: sim.user},
        {name: LABELS.TEAM, value: sim.team},
        {name: LABELS.WORK_UNIT, value: `${sim.project}(${sim.run},${sim.clone},${sim.gen})`},
    ];
    return [
        {
            name: 'simulation_eta_seconds',
            value: sim.eta,
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'simulation_deadline_timestamp',
            value: sim.deadline,
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'simulation_timeout_timestamp',
            value: sim.timeout,
            type: PrometheusMetricType.GAUGE,
            labels,
        },
        {
            name: 'simulation_start_timestamp',
            value: new Date(sim.start_time).getTime()/1000,
            type: PrometheusMetricType.GAUGE,
            labels,
        },
    ];
}).flat(1);

const mapToPromMetrics = ({slotsInfo, queuesInfo, simulationsInfo}: FAHInfo): PrometheusMetric[] => {
    const slotMetrics: PrometheusMetric[] = slotsInfo ? mapSlotsInfo(slotsInfo) : [];
    const queueMetrics: PrometheusMetric[] = queuesInfo ? mapQueuesInfo(queuesInfo) : [];
    const simulationInfo: PrometheusMetric[] = simulationsInfo ? mapSimulationInfo(simulationsInfo) : [];

    return [
        ...slotMetrics,
        ...queueMetrics,
        ...simulationInfo,
    ];
};

export default mapToPromMetrics;