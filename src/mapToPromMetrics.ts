import {SlotInfo} from './types';

interface PrometheusLabel {
    name: string;
    value: string;
}

enum PrometheusMetricType {
    COUNTER = "counter",
    GAUGE = "gauge",
    HISTOGRAM = "histogram",
    SUMMARY = "summary",
}

interface PrometheusMetric {
    name: string;
    value: number;
    labels?: PrometheusLabel[];
    description?: string;
    type?: PrometheusMetricType;
}

const LABELS = {
    SLOT: 'slot',
    STATUS: 'status',
};

const mapSlotsInfo = (slotsInfo: SlotInfo[]): PrometheusMetric[] => slotsInfo.map((slot) => [
    {
        name: 'slot_idle',
        value: slot.idle ? 1 : 0,
        type: PrometheusMetricType.GAUGE,
        labels: [
            {name: LABELS.SLOT, value: slot.id},
        ]
    },
    {
        name: 'slot_running',
        value: slot.status === 'RUNNING' ? 1 : 0,
        type: PrometheusMetricType.GAUGE,
        labels: [
            {name: LABELS.SLOT, value: slot.id},
        ]
    },
    {
        name: 'slot_status',
        value: 1,
        labels: [
            {name: LABELS.SLOT, value: slot.id},
            {name: LABELS.STATUS, value: slot.status},
        ]
    }
]).flat(1);

const mapToPromMetrics = ({slotsInfo}: { slotsInfo: SlotInfo[] }): PrometheusMetric[] => {
    const slotMetrics: PrometheusMetric[] = mapSlotsInfo(slotsInfo);

    return [
        ...slotMetrics
    ];
};

export default mapToPromMetrics;