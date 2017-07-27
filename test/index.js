import test from 'ava';
import * as Engine from '../lib';

test('it exists', t => {
  t.not(Engine, undefined);
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
