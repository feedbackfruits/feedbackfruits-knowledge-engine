import Quad from './quad';
import Doc from './doc';
import { promises as jsonld } from 'jsonld';
// import * as isuri from 'isuri';
import * as memux from 'memux';
import * as Context from 'feedbackfruits-knowledge-context';

export function iriify(str: string) {
  return `<${str}>`;
}

export function encodeIRI(str: string) {
  if (isURI(str)) return iriify(str);
  return str;
}

export function isURI(str: string) {
  // isuri.isValid(str)
  return /\w+:(\/?\/?)[^\s]+/.test(str);
}

export function isIRI(str: string) {
  return /<(.*)>/.test(str);
}

export function decodeIRI(str: string) {
  if (isIRI(str)) return str.slice(1, str.length - 1);
  return str;
}

export async function getDoc(config, subject): Promise<Doc> {
  const { CAYLEY_ADDRESS } = config;

  console.log('Getting quads for:', subject);
  const query = `
  var subject = ${JSON.stringify(encodeIRI(subject))};
  g.V(subject)
  	.OutPredicates()
  	.ForEach(function mapPredicates(node) {
        var predicate = node.id;
        return g.V(subject)
          .Out(predicate)
          .ForEach(function emitObject(node) {
            var object = node.id;
            g.Emit({
              subject: subject,
              predicate: predicate,
              object: object
            });
          });
      })`;

  const url = `${CAYLEY_ADDRESS}/api/v1/query/gizmo`;
  // console.log('Fetching from url:', url, fetch.toString());

  const response = await fetch(url, {
    method: 'post',
    body: query
  });
  const { result: quads = [] } = await response.json();

  return Doc.fromQuads(quads, Context.context);
}
