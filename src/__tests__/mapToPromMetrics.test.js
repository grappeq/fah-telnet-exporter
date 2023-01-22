import {describe, it} from 'mocha';
import {expect} from 'chai';
import mapToPromMetrics from '../mapToPromMetrics.js';
import sampleFetchedMetrics1 from './sample-fetched-metrics-1.js';

const test = {
  'id': '00',
  'state': 'RUNNING',
  'error': 'NO_ERROR',
  'project': 18404,
  'run': 115,
  'clone': 1,
  'gen': 128,
  'core': '0xa8',
  'unit': '0x0000000100000080000047e400000073',
  'percentdone': '23.01%',
  'eta': '17 hours 36 mins',
  'ppd': '78163',
  'creditestimate': '74454',
  'waitingon': '',
  'nextattempt': '0.00 secs',
  'timeremaining': '3.01 days',
  'totalframes': 100,
  'framesdone': 23,
  'assigned': '2023-01-19T14:25:59Z',
  'timeout': '2023-01-23T14:25:59Z',
  'deadline': '2023-01-23T19:13:59Z',
  'ws': '129.32.209.203',
  'cs': '129.32.209.205',
  'attempts': 0,
  'slot': '00',
  'tpf': '13 mins 43 secs',
  'basecredit': '58110',
};

describe('mapToPromMetrics', function() {
  it('should properly map slot info', async () => {
    const {slotInfo} = sampleFetchedMetrics1;
    const mappedMetrics = mapToPromMetrics({slotInfo});
    expect(mappedMetrics).to.deep.include({});
  });
});
