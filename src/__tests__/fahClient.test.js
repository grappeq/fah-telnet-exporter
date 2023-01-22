import {assert, expect} from 'chai';
import FahTelnetClient from '../fahClient';
import {describe, it} from 'mocha';
import sinon from 'sinon';

describe('FahTelnetClient', function() {
  describe('fetchAllInfo', function() {
    it('should return fetched data', async () => {
      // GIVEN
      const client = new FahTelnetClient();
      client.connect = sinon.fake();
      client.fetchInfo = sinon.fake.returns({
        'version': '1',
        'messageName': 'messagename',
        'content': {'some': 'json object'},
      });
      client.fetchSimulationInfo = sinon.fake.returns([
        {'some': 'json object'},
        {'some': 'json object'},
      ]);
      // WHEN
      await client.connect();
      const {slotInfo, queueInfo, simulationInfo} = await client.fetchAllInfo();
      // THEN
      assert(client.connect.called);
      assert(client.fetchInfo.called);
      expect(slotInfo).to.deep.equal({'some': 'json object'});
      expect(queueInfo).to.deep.equal({'some': 'json object'});
      expect(simulationInfo).to.deep.equal([
        {'some': 'json object'},
        {'some': 'json object'},
      ]);
    });
  });
});