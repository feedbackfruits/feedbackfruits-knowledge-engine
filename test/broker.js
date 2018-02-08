import test from 'ava';

import { Broker } from '../lib';
import memux from 'memux';
import * as Config from '../lib/config';
import * as Support from './support';


test('it works', async (t) => {
  try {
    const { NAME, KAFKA_ADDRESS, INPUT_TOPIC } = Object.assign({}, Config.Base, Config.Broker);
    const operation = { action: 'write', key: Support.compacted["@graph"][0]["@id"], data: Support.compacted["@graph"][0]}
    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    async function init({ name }) {
      const receive = async (operation) => {
        console.log('Received!', operation, typeof send);
        _resolve(operation);
      };

      return Broker({
        name,
        receive
      });
    }

    const send = await memux({
      name: 'dummy-broker',
      url: KAFKA_ADDRESS,
      output: INPUT_TOPIC,
      concurrency: 1
    });

    await init({
      name: NAME,
    });

    await send(operation);

    console.log('Waiting for result promise...');
    let result = await resultPromise;
    console.log('Result promise resolved!');
    console.log('Result data:', JSON.stringify(result));
    return t.deepEqual(result, { action: 'write', key: Support.compacted["@graph"][0]["@id"], data: Support.expanded[0]["@graph"][0], label: 'dummy-broker' });
  } catch(e) {
    console.error(e);
    throw e;
  }
});
