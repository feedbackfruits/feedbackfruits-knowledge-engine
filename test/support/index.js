import test from 'ava';
import * as fs from 'fs';

test.skip('Support noop', () => {
  t.pass();
})

const expanded = require('./expanded');
const quads = require('./quads');
const compacted = require('./compacted');

const compactedVideo = require('./Video/compacted');
const expandedVideo = require('./Video/expanded');

const flattenedExpandedVideo = require('./Video/flattened-expanded');

const taggedExpandedVideo = require('./Video/expanded-tagged');
const taggedCompactedVideo = require('./Video/compacted-tagged');

const flattenedTaggedExpandedVideo = require('./Video/flattened-expanded-tagged');
const flattenedTaggedCompactedVideo = require('./Video/flattened-compacted-tagged');

const breaksWithoutLabels = require('./breaks-without-labels');

const { context } = require('feedbackfruits-knowledge-context');

const nquads = fs.readFileSync(__dirname + '/nquads.nq').toString();

const xmlCaptions = fs.readFileSync(__dirname + '/captions/captions.xml').toString();
const xmlParsed = require('./captions/xml-parsed');
const captions = {
  xml: xmlCaptions,
  xmlParsed
};

export function sort(docs) {
  return sortArray(sortAnnotations(sortTags(sortCaptions(docs))));
}

export function sortArray(docs) {
  return docs.sort((a, b) => {
    if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
    return a["@id"].localeCompare(b["@id"]);
  });
}

export function sortAnnotations(docs) {
  return docs.map(doc => {
    if (!('annotation' in doc)) return doc;
    return {
      ...doc,
      annotation: sortArray(doc.annotation)
    }
  });
}

export function sortTags(docs) {
  return docs.map(doc => {
    if (!('tag' in doc)) return doc;
    return {
      ...doc,
      tag: sortArray(doc.tag)
    }
  });
}

export function sortCaptions(docs) {
  return docs.map(doc => {
    if (!('caption' in doc)) return doc;
    return {
      ...doc,
      caption: sortArray(doc.caption)
    }
  });
}

export {
  context,
  expanded,
  compacted,
  quads,
  nquads,
  compactedVideo,
  expandedVideo,
  flattenedExpandedVideo,
  taggedExpandedVideo,
  taggedCompactedVideo,
  flattenedTaggedExpandedVideo,
  flattenedTaggedCompactedVideo,
  breaksWithoutLabels,
  captions
};
