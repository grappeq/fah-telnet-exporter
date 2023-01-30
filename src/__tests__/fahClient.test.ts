import {assert, expect} from 'chai';
import FahTelnetClient from '../fahClient';
import {describe, it} from 'mocha';
import sinon from 'sinon';

const makeFakeFetcherClient = (...clientConfig: any[]) => {
    const client = new FahTelnetClient(...clientConfig);
    client.connect = sinon.fake();
    // @ts-ignore
    client.fetchInfo = sinon.fake.returns({
        'version': '1',
        'messageName': 'messagename',
        'content': {'some': 'json object'},
    });
    // @ts-ignore
    client.fetchAllSimulationInfo = sinon.fake.returns([{'some': 'json object'}, {'some': 'json object'}]);
    return client;
}

describe('FahTelnetClient', function () {
    describe('fetchAllInfo', function () {
        // TODO more tests where TelnetClient is simulated
        it('should return fetched data', async () => {
            // GIVEN
            const client = makeFakeFetcherClient();
            // WHEN
            await client.connect();
            const {slotsInfo, queuesInfo, simulationsInfo} = await client.fetchAllInfo();
            // THEN
            // @ts-ignore
            assert(client.connect.called);
            // @ts-ignore
            assert(client.fetchInfo.called);
            expect(slotsInfo).to.deep.equal({'some': 'json object'});
            expect(queuesInfo).to.deep.equal({'some': 'json object'});
            expect(simulationsInfo).to.deep.equal([
                {'some': 'json object'},
                {'some': 'json object'},
            ]);
        });

        it('should fetch simulation-info sequentially', async () => {
            // TODO
        });

        it('should handle auth', async () => {
            // GIVEN
            const client = new FahTelnetClient({hostname: 'example.com', port: 12345}, 'passssword');
            // @ts-ignore
            client.connection.connect = sinon.stub().returns(Promise.resolve());
            client.connection.exec = sinon.stub().returns(Promise.resolve('    OK   '));
            // WHEN
            await client.connect();
            // THEN
            // @ts-ignore
            sinon.assert.calledOnceWithMatch(client.connection.exec, 'auth passssword');
        });
    });
});