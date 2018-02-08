import test from 'ava';
import * as fs from 'fs';

const expanded = require('./expanded');
const quads = require('./quads');
const compacted = require('./compacted');
const annotatedYTVideo = require('./annotated-yt-video');
const expandedAnnotatedYTVideo = require('./expanded-annotated-yt-video');
const context = require('./context');

const nquads = fs.readFileSync(__dirname + '/nquads.nq').toString();

export {
  context,
  expanded,
  compacted,
  quads,
  nquads,
  annotatedYTVideo,
  expandedAnnotatedYTVideo,
};

// This is a bit hacky, but ava complains otherwise
test('support', t => {
  t.pass();
});
