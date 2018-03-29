import test from 'ava';
import Doc from '../lib/doc';
import * as Support from './support';
import Context from 'feedbackfruits-knowledge-context';

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

test('Doc.keys: it return keys', t => {
  const res = Doc.keys(Support.expanded, Support.context);
  return t.deepEqual(res, [
    'http://schema.org/description',
    'http://schema.org/image',
    'http://schema.org/license',
    'http://schema.org/name',
    'http://schema.org/sourceOrganization',
    'https://knowledge.express/topic',
  ]);
});

test('Doc.fromQuads', t => {
  return Doc.fromQuads(Support.quads, Support.context).then(res => {
    return t.deepEqual(res, Support.expanded);
  })
});

test('Doc.toQuads', async (t) => {
  return Doc.toQuads(Support.expanded).then(res => {
    // console.log(JSON.stringify(res));
    return t.deepEqual(res , Support.quads);
  })
});

test('Doc.validate: it validates', async t => {
  // const flattened = await Doc.flatten(Support.compactedVideo, Support.context);
  // console.log(flattened);
  return Doc.validate(Support.compactedVideo, Support.context).then(res => {
    return t.deepEqual(res, true);
  });
});

test('Doc.validate: it throws errors', async t => {
  const error = await t.throws(Doc.validate({ ...Support.compactedVideo, ["http://blabla.com/fake"]: "someValue" }, Support.context));
  return t.is(error.message, `Doc contains invalid key "http://blabla.com/fake".`);
});

test('Doc.compare: it compares', async t => {
  t.is(await Doc.compare(Support.expanded, Support.expanded, Support.context), 0);
  t.is(await Doc.compare(Support.expanded, {}, Support.context), 1);
  t.is(await Doc.compare({}, Support.expanded, Support.context), -1);
  return;
});

test('Doc.compare: it bridges compaction', async t => {
  t.is(await Doc.compare(Support.compacted, Support.expanded, Support.context), 0);
  return;
});


test('Doc.compact: it compacts', t => {
  return Doc.compact(Support.expanded, Support.context).then(res => {
    return t.deepEqual(res, Support.compacted);
  })
});

test('Doc.compact: it compacts complex things', t => {
  return Doc.compact(Support.expandedVideo, Support.context).then(res => {
    return t.deepEqual(res, Support.compactedVideo);
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

test('Doc.expand: it expands complex things', t => {
  return Doc.expand(Support.compactedVideo, Support.context).then(res => {
    return t.deepEqual(res, Support.expandedVideo);
  })
});

test('Doc.expand: you only expand once', t => {
  return Doc.expand(Support.expanded, Support.context).then(res => {
    return t.deepEqual(res, Support.expanded);
  })
});

test('Doc.flatten: it flattens', t => {
  return Doc.flatten(Support.taggedExpandedVideo, Support.context).then(res => {
    // console.log(JSON.stringify(res));
    return t.deepEqual(Support.sort(res), Support.sort(Support.flattenedTaggedCompactedVideo));
  })
});

test('Doc.flatten: you may only flatten once', t => {
  return Doc.flatten(Support.flattenedTaggedCompactedVideo, Support.context).then(res => {
    // console.log(JSON.stringify(res));
    return t.deepEqual(Support.sort(res), Support.sort(Support.flattenedTaggedCompactedVideo));
  })
});

// test('Doc.frame: it frames', t => {
//   const frame = {
//     "@type": "Resource",
//   };
//
//   return Doc.frame(Support.taggedExpandedVideo, { "@context": Support.context, ...frame }).then(res => {
//     console.log(JSON.stringify(res));
//     return t.deepEqual(Support.sort(res), Support.sort([ Support.taggedCompactedVideo ]));
//   })
// });

test('Doc.fullfilsFrame: it check if a frame is fullfilled by a graph', async t => {
  const frame = {
    "@type": "Resource",
    "caption": {
      "@type": "VideoCaption",
      "text": {}
    }
  };

  const res = await Doc.fullfilsFrame(Support.flattenedExpandedVideo.slice(0), { "@context": Support.context, ...frame })
  console.log(JSON.stringify(res));
  return t.is(res, true);
});
