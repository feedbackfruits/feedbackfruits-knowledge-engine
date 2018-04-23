import test from 'ava';
import * as Helpers from '../lib/helpers';
import * as Support from './support';

test('it works', t => {
  return t.pass();
});

test('isIRI: it recognizes IRIs as IRIs', t => {
  const iri = "<http://www.w3.org/2001/XMLSchema#integer>";
  const res = Helpers.isIRI(iri);
  return t.is(res, true);
});

test('isIRI: it doesn\'t recognize other things as IRIs', t => {
  const text = "This is a strong <b>test</b>!";
  t.is(Helpers.isIRI(text), false);

  const img = "<img src='test' />";
  t.is(Helpers.isIRI(img), false);

  const notUriIri = "<notAURI>";
  t.is(Helpers.isIRI(notUriIri), false);

  return;
});

test('encodeRDF: it encodes literals', t => {
  const value = `"1"`;
  const type = "<http://www.w3.org/2001/XMLSchema#integer>";
  const literal = `${value}^^${type}`;
  const res = Helpers.encodeRDF(literal);
  return t.is(res, `${value}^^${type}`);
});
