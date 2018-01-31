import test from 'ava';
import Doc from '../lib/doc';
import * as Support from './support';

test('Doc.isDoc', t => {
  const doc = { '@id': '' };
  t.is(Doc.isDoc(doc), true);

  let notDoc;
  t.not(Doc.isDoc(notDoc), true);
  notDoc = null;
  t.not(Doc.isDoc(notDoc), true);
  notDoc = 1234;
  t.not(Doc.isDoc(notDoc), true);
  notDoc = 'test';
  t.not(Doc.isDoc(notDoc), true);
  notDoc = {};
  t.not(Doc.isDoc(notDoc), true);
  notDoc = () => {};
  t.not(Doc.isDoc(notDoc), true);
});

test('Doc.compact: it compacts', t => {
  return Doc.compact(Support.expanded, Support.context).then(res => {
    return t.deepEqual(res, Support.compacted);
  })
});

test('Doc.compact: you only compact once', t => {
  return Doc.compact(Support.compacted, Support.context).then(res => {
    return t.deepEqual(res, Support.compacted);
  })
});

test('Doc.expand: it expands', t => {
  return Doc.expand(Support.compacted, Support.context).then(res => {
    return t.deepEqual(res, Support.expanded);
  })
});

test('Doc.expand: you only expand once', t => {
  return Doc.expand(Support.expanded, Support.context).then(res => {
    return t.deepEqual(res, Support.expanded);
  })
});

// test('Doc.flatten: it flattens', t => {
//   return Doc.expand(Support.expanded, Support.context).then(res => {
//     return t.deepEqual(res, Support.expanded);
//   })
// });
