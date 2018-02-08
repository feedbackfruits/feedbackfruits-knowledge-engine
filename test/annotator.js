import test from 'ava';
import sinon from 'sinon';

import { Annotator } from '../lib';
import memux from 'memux';
import * as Config from '../lib/config';
import * as Support from './support';


test('it sends', async (t) => {
  try {
    const { NAME, KAFKA_ADDRESS, INPUT_TOPIC, OUTPUT_TOPIC } = Object.assign({}, Config.Base, Config.Annotator);

    async function init({ name }) {
      const receive = async (send) => async (operation) => {
        console.log('Received!', operation, typeof send);
        const { action, data } = operation;
        return send({ action, key: data['@id'], data });
      };

      return Annotator({
        name,
        receive
      });
    }

    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const spy = sinon.spy();
    let count = 0;
    const receive = (message) => {
      console.log('Received message!', message);
      count++;
      count === 1 ? _resolve(message) : spy();
    };

    console.log('Memuxing:', 'input topic', INPUT_TOPIC, 'output topic', OUTPUT_TOPIC);

    const send = await memux({
      name: 'dummy-broker',
      url: KAFKA_ADDRESS,
      input: OUTPUT_TOPIC,
      output: INPUT_TOPIC,
      receive,
      options: {
        concurrency: 1
      }
    });

    await init({
      name: NAME,
    });

    // const waitingPromise = new Promise((resolve) => {
    //   setTimeout(() => resolve(), 7000);
    // });
    //
    // await waitingPromise;

    const operation = { action: 'write', key: Support.compacted["@graph"][0]["@id"], data: Support.compacted}

    await send(operation);

    let result = await resultPromise;
    return t.deepEqual(result, { ...operation, data: Support.compacted["@graph"][0], label: NAME });
  } catch(e) {
    console.error(e);
    throw e;
  }
});
