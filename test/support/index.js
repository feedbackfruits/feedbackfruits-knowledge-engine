import test from 'ava';
import * as fs from 'fs';

const expanded = require('./expanded');
const quads = require('./quads');
const compacted = require('./compacted');
const annotatedYTVideo = require('./annotated-yt-video');
const expandedAnnotatedYTVideo = require('./expanded-annotated-yt-video');
const taggedExpandedYTVideo = require('./tagged-expanded-yt-video');
const taggedCompactedYTVideo = require('./tagged-compacted-yt-video');
const flattenedTaggedExpandedYTVideo = require('./flattened-tagged-expanded-yt-video');
const flattenedTaggedCompactedYTVideo = require('./flattened-tagged-compacted-yt-video');
const context = require('./context');

const nquads = fs.readFileSync(__dirname + '/nquads.nq').toString();

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
  annotatedYTVideo,
  expandedAnnotatedYTVideo,
  taggedExpandedYTVideo,
  taggedCompactedYTVideo,
  flattenedTaggedExpandedYTVideo,
  flattenedTaggedCompactedYTVideo
};

// This is a bit hacky, but ava complains otherwise
test('support', t => {
  t.pass();
});
