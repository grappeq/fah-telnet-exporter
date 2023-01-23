import renderPromMetrics from '../renderPromMetrics';
import {expect} from 'chai';
import {PrometheusMetric, PrometheusMetricType} from "../types";

describe('renderPromMetrics', function () {
    it('should render metric with description', async () => {
        const metric: PrometheusMetric = {
            description: "Fancy Metric",
            name: "fancy_metric",
            value: 2137,
        };
        expect(renderPromMetrics([metric])).to.deep.equal(
            '# HELP fancy_metric Fancy Metric\n' +
            'fancy_metric 2137'
        );
    });

    it('should render metric with type', async () => {
        const metric: PrometheusMetric = {
            type: PrometheusMetricType.GAUGE,
            name: "fancy_metric",
            value: 2137,
        };
        expect(renderPromMetrics([metric])).to.deep.equal(
            '# TYPE fancy_metric gauge\n' +
            'fancy_metric 2137'
        );
    });

    it('should render metric with 1 label', async () => {
        const metric: PrometheusMetric = {
            name: "fancy_metric",
            value: 2137,
            labels: [
                {name: 'jp2', value: 'gmd'},
            ]
        };
        expect(renderPromMetrics([metric])).to.deep.equal(
            'fancy_metric{jp2="gmd"} 2137'
        );
    });

    it('should render metric with 2 labels', async () => {
        const metric: PrometheusMetric = {
            name: "fancy_metric",
            value: 2137,
            labels: [
                {name: 'jp1', value: 'trial'},
                {name: 'jp2', value: 'gmd'},
            ]
        };
        expect(renderPromMetrics([metric])).to.deep.equal(
            'fancy_metric{jp1="trial",jp2="gmd"} 2137'
        );
    });

    it('should render metric with labels, type and description', async () => {
        const metric: PrometheusMetric = {
            name: "fancy_metric",
            value: 2137,
            labels: [
                {name: 'jp1', value: 'trial'},
                {name: 'jp2', value: 'gmd'},
            ],
            type: PrometheusMetricType.HISTOGRAM,
            description: "Fancy Metric",
        };
        expect(renderPromMetrics([metric])).to.deep.equal(
            '# HELP fancy_metric Fancy Metric\n' +
            '# TYPE fancy_metric histogram\n' +
            'fancy_metric{jp1="trial",jp2="gmd"} 2137'
        );
    });

    it('should render multiple metrics', async () => {
        const metrics: PrometheusMetric[] = [
            {
                name: "fancy_metric",
                value: 2137,
                labels: [
                    {name: 'jp1', value: 'trial'},
                    {name: 'jp2', value: 'gmd'},
                ],
                type: PrometheusMetricType.HISTOGRAM,
                description: "Fancy Metric",
            },
            {
                name: "another_metric",
                description: "Another Metric",
                value: 2137,
            },
            {
                name: "the_best_metric",
                value: 2137,
                labels: [
                    {name: 'kupa', value: 100},
                ]
            }
        ];
        const renderedOutput = renderPromMetrics(metrics);
        expect(renderedOutput).to.deep.equal(
            '# HELP fancy_metric Fancy Metric\n' +
            '# TYPE fancy_metric histogram\n' +
            'fancy_metric{jp1="trial",jp2="gmd"} 2137\n' +
            '\n' +
            '# HELP another_metric Another Metric\n' +
            'another_metric 2137\n' +
            '\n' +
            'the_best_metric{kupa="100"} 2137'
        );
    });
});
