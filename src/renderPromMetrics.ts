/*
We are rendering metrics in Prometheus text-based format which looks something like this:
# HELP http_requests_total The total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{method="post",code="200"} 1027 1395066363000

For details see: https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format
*/

import {PrometheusLabel, PrometheusMetric} from "./types";


const renderLabelsString = (labels: PrometheusLabel[]): string => {
    const labelStrings = labels.map(({name, value}) => `${name}="${value}"`);
    const labelStringsCombined = labelStrings.join(',')
    return `{${labelStringsCombined}}`
};

const renderMetric = (metric: PrometheusMetric, prefix?: string): string => {
    const fullMetricName = prefix !== undefined ? `${prefix}${metric.name}` : metric.name;
    const str = [];
    if (metric.description) {
        str.push(`# HELP ${fullMetricName} ${metric.description}`)
    }
    if (metric.type) {
        str.push(`# TYPE ${fullMetricName} ${metric.type}`)
    }
    const labelString = metric.labels ? renderLabelsString(metric.labels) : '';
    str.push(`${fullMetricName}${labelString} ${metric.value}`)
    return str.join('\n');
};

const renderPromMetrics = (metrics: PrometheusMetric[], prefix?: string): string => {
    return metrics.map((metric) => renderMetric(metric, prefix)).join('\n\n');
}

export default renderPromMetrics;