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
      // @ts-ignore
      client.fetchInfo = sinon.fake.returns({
        'version': '1',
        'messageName': 'messagename',
        'content': {'some': 'json object'},
      });
      // @ts-ignore
      client.fetchSimulationInfo = sinon.fake.returns([
        {'some': 'json object'},
        {'some': 'json object'},
      ]);
      // WHEN
      await client.connect();
      const {slotsInfo, queuesInfo, simulationInfo} = await client.fetchAllInfo();
      // THEN
      // @ts-ignore
      assert(client.connect.called);
      // @ts-ignore
      assert(client.fetchInfo.called);
      expect(slotsInfo).to.deep.equal({'some': 'json object'});
      expect(queuesInfo).to.deep.equal({'some': 'json object'});
      expect(simulationInfo).to.deep.equal([
        {'some': 'json object'},
        {'some': 'json object'},
      ]);
    });
  });
});