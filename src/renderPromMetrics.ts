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

const renderMetric = (metric: PrometheusMetric): string => {
    const str = [];
    if (metric.description) {
        str.push(`# HELP ${metric.name} ${metric.description}`)
    }
    if (metric.type) {
        str.push(`# TYPE ${metric.name} ${metric.type}`)
    }
    const labelString = metric.labels ? renderLabelsString(metric.labels) : '';
    str.push(`${metric.name}${labelString} ${metric.value}`)
    return str.join('\n');
};

const renderPromMetrics = (metrics: PrometheusMetric[]): string => {
    return metrics.map(renderMetric).join('\n\n');
}

export default renderPromMetrics;