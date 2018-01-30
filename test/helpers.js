import test from 'ava';
import * as Helpers from '../lib/helpers';
import * as Support from './support';

test('quadsToDocs', t => {
  return Helpers.quadsToDocs(Support.quads, Support.context).then(res => {
    return t.deepEqual(res, Support.expanded);
  })
});

test('docToQuads', async (t) => {
  return Helpers.docToQuads(Support.expanded).then(res => {
    // console.log(JSON.stringify(res));
    return t.deepEqual(res , Support.quads);
  })
});
