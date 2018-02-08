import test from 'ava';
import sinon from 'sinon';

import { Miner } from '../lib';
import memux from 'memux';
import * as Config from '../lib/config';
import * as Support from './support';


test('it sends', async (t) => {
  try {
    const { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC } = Object.assign({}, Config.Base, Config.Miner);
    const operation = { action: 'write', data: Support.compacted}

    async function init({ name }) {
      const send = await Miner({
        name,
        customConfig: {
          OUTPUT_TOPIC: 'miner_update_requests'
        }
      });

      return send(operation);
    }

    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const receive = (message) => {
      console.log('Received message!', message);
      _resolve(message);
    };

    await memux({
      name: 'dummy-broker',
      url: KAFKA_ADDRESS,
      input: 'miner_update_requests',
      receive,
      concurrency: 1
    });

    await init({
      name: NAME,
    });

    // console.log('Miner is waiting...');
    // const waitingPromise = new Promise((resolve) => {
    //   setTimeout(() => {console.log("Miner may sends now"); resolve()}, 15000);
    // });
    //
    // await waitingPromise;

    console.log('Waiting for result promise...');
    let result = await resultPromise;
    console.log('Result promise resolved!');
    return t.deepEqual(result, { action: 'write', key: Support.compacted["@graph"][0]["@id"], data: Support.compacted["@graph"][0], label: NAME });
  } catch(e) {
    console.error(e);
    throw e;
  }
});
