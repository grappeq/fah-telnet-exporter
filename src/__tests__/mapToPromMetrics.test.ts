import {describe, it} from 'mocha';
import {expect} from 'chai';
import mapToPromMetrics from '../mapToPromMetrics';
import sampleFetchedMetrics1 from './sample-fetched-metrics-1.js';
import expectedMappedQueueMetrics from './mappedQueueMetrics.json'


describe('mapToPromMetrics', function () {
    it('should properly map slot info', async () => {
        // GIVEN
        const {slotsInfo} = sampleFetchedMetrics1;

        // WHEN
        const mappedMetrics = mapToPromMetrics({slotsInfo});

        // THEN
        expect(mappedMetrics).to.deep.include({
            name: 'slot_idle',
            value: 1,
            type: 'gauge',
            labels: [
                {name: 'slot', value: '00'},
            ]
        });
        expect(mappedMetrics).to.deep.include({
            name: 'slot_idle',
            value: 0,
            type: 'gauge',
            labels: [
                {name: 'slot', value: '01'},
            ]
        });
        expect(mappedMetrics).to.deep.include({
            name: 'slot_running',
            value: 0,
            type: 'gauge',
            labels: [
                {name: 'slot', value: '00'},
            ]
        });
        expect(mappedMetrics).to.deep.include({
            name: 'slot_running',
            value: 1,
            type: 'gauge',
            labels: [
                {name: 'slot', value: '01'},
            ]
        });
        expect(mappedMetrics).to.deep.include({
            name: 'slot_status',
            value: 1,
            labels: [
                {name: 'slot', value: '00'},
                {name: 'status', value: 'PAUSED'},
            ]
        });
        expect(mappedMetrics).to.deep.include({
            name: 'slot_status',
            value: 1,
            labels: [
                {name: 'slot', value: '01'},
                {name: 'status', value: 'RUNNING'},
            ]
        });
    });

    it('should handle empty info', async () => {
        // GIVEN WHEN
        const mappedMetrics = mapToPromMetrics({slotsInfo: [], queuesInfo: []});

        // THEN
        expect(mappedMetrics).to.be.an('array').that.is.empty;
    });

    it('should properly map queue info', async () => {
        // GIVEN
        const {queuesInfo} = sampleFetchedMetrics1;

        // WHEN
        const mappedMetrics = mapToPromMetrics({queuesInfo});

        // THEN
        expectedMappedQueueMetrics.forEach(metric => {
            expect(mappedMetrics).to.deep.include(metric);
        });
    });
});
