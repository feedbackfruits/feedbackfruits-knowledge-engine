import test from 'ava';
import Quad from '../lib/quad';
import * as Support from './support';

test('Quad.isQuad', t => {
  const quad = { subject: '', predicate: '', object: '' };
  t.is(Quad.isQuad(quad), true);

  let notQuad;
  t.not(Quad.isQuad(notQuad), true);
  notQuad = null;
  t.not(Quad.isQuad(notQuad), true);
  notQuad = 1234;
  t.not(Quad.isQuad(notQuad), true);
  notQuad = 'test';
  t.not(Quad.isQuad(notQuad), true);
  notQuad = {};
  t.not(Quad.isQuad(notQuad), true);
  notQuad = () => {};
  t.not(Quad.isQuad(notQuad), true);
});

test('Quad.fromNQuads', t => {
  const res = Quad.fromNQuads(Support.nquads);
  console.log(JSON.stringify(res));
  return t.deepEqual(res, Support.quads);
})

test('Quad.toNQuads', t => {
  const res = Quad.toNQuads(Support.quads);
  // console.log(res);
  return t.deepEqual(res, Support.nquads);
})
