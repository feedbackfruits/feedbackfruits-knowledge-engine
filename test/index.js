import test from 'ava';
import * as Engine from '../lib';

import * as Context from 'feedbackfruits-knowledge-context';

test('it exists', t => {
  t.not(Engine, undefined);
});

test('it re-exports feedbackfruits-knowledge-context', t => {
  t.is(Engine.Context, Context);
});

test('it has a Miner function', t => {
  t.is(typeof Engine.Miner, 'function');
});

test('it has an Annotator function', t => {
  t.is(typeof Engine.Annotator, 'function');
});

test('it has a Broker function', t => {
  t.is(typeof Engine.Broker, 'function');
});
