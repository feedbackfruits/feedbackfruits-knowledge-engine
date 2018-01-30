import test from 'ava';
import sinon from 'sinon';

import { Annotator } from '../lib';
import memux from 'memux';
import * as Config from '../lib/config';

const { NAME, KAFKA_ADDRESS, INPUT_TOPIC, OUTPUT_TOPIC } = Object.assign({}, Config.Base, Config.Annotator);

async function init({ name }) {
  const receive = (send) => (operation) => {
    const { action, data } = operation;
    return send({ action, key: data['@id'], data });
  };

  return Annotator({
    name,
    receive
  });
}

const videoDoc = {
  "@id": "https://www.youtube.com/watch?v=pi3WWQ0q6Lc",
  "http://schema.org/sourceOrganization": [
    "KhanAcademy"
  ],
  "http://schema.org/license": [
    "<http://creativecommons.org/licenses/by-nc-sa/3.0>"
  ],
  "http://schema.org/name": [
    "Multiplying positive and negative fractions"
  ],
  "http://schema.org/description": [
    "See examples of multiplying and dividing fractions with negative numbers."
  ],
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
    "<http://schema.org/VideoObject>",
    "<https://knowledge.express/Resource>"
  ],
  "https://knowledge.express/topic": [
    "<https://www.khanacademy.org/video/multiplying-negative-and-positive-fractions>"
  ],
  "http://schema.org/image": [
    "<https://cdn.kastatic.org/googleusercontent/vkR4iP2PXl0SGkwmmpX-7N9mKNP7RWX8ilHMuROW745BJBvmp_eElCItbyPY-tweaVYgddFoNaaHpXSanPm92ZUS>"
  ]
};

const concepts = [
  "<http://dbpedia.org/resource/Divisor>",
  "<http://dbpedia.org/resource/Elementary_arithmetic>",
  "<http://dbpedia.org/resource/Integer>",
  "<http://dbpedia.org/resource/Greatest_common_divisor>",
];

test('it exists', t => {
  t.not(init, undefined);
});

test('it works and deduplicates', async (t) => {
  try {
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

    // const doc = {
    //   '@id': 'http://some.domain/testdoc',
    //   'http://schema.org/name': [ 'bla' ],
    // };
    const operation = { action: 'write', key: videoDoc['@id'], data: videoDoc}

    const waitingPromise = new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });

    await send(operation);

    let result = await resultPromise;
    t.deepEqual(result, { ...operation, label: NAME });

    await send(operation);
    await waitingPromise;
    return t.is(spy.called, false);
  } catch(e) {
    console.error(e);
    throw e;
  }
});
