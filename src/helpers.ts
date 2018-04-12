import Quad from './quad';
import Doc from './doc';
import { promises as jsonld } from 'jsonld';
import * as isuri from 'isuri';
import * as memux from 'memux';
import * as Context from 'feedbackfruits-knowledge-context';

export function iriify(str: string) {
  return `<${str}>`;
}

export function encodeRDF(str: string) {
  if (isURI(str)) return iriify(str);
  if (isLiteral(str)) return encodeLiteral(str);
  return str.replace(/\n/g, "\\n");
}

export function isLiteral(str: string) {
  return /\^\^/.test(str);
}

export function encodeLiteral(str) {
  const [ value, type ] = str.split("^^");
  return `${value}^^${iriify(type)}`;
}

export function isURI(str: string) {
  return isuri.isValid(str);
  // return /\w+:(\/?\/?)[^\s]+/.test(str);
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
  var subject = ${JSON.stringify(encodeRDF(subject))};
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
