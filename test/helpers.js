import test from 'ava';
import * as Helpers from '../lib/helpers';
import * as Support from './support';

test('it works', t => {
  return t.pass();
});

test('encodeRDF: it encodes literals', t => {
  const value = `"1"`;
  const type = "<http://www.w3.org/2001/XMLSchema#integer>";
  const literal = `${value}^^${type}`;
  const res = Helpers.encodeRDF(literal);
  return t.is(res, `${value}^^${type}`);
});
