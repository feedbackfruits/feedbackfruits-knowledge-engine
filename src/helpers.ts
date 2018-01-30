import Quad from './quad';
import Doc from './doc';
import { promises as jsonld } from 'jsonld';
import * as isuri from 'isuri';
import * as memux from 'memux';
import * as Context from 'feedbackfruits-knowledge-context';

export function iriify(str: string) {
  return `<${str}>`;
}

export function encodeIRI(str: string) {
  if (isuri.isValid(str)) return iriify(str);
  return str;
}

export function isIRI(str: string) {
  return /<(.*)>/.test(str);
}

export function decodeIRI(str: string) {
  if (isIRI(str)) return str.slice(1, str.length - 1);
  return str;
}

export function createSend(config: memux.SendConfig<Doc>): (operation: memux.Operation<Doc>) => Promise<memux.Operation<Doc>> {
  return async ({ action, key, data}) => {
    const sendFn = await memux.createSend(config);

    const compactedDoc = await Doc.compact(data, { "@context": [] });

    return sendFn({ action, key, data: compactedDoc });
  };
}

export function createReceive(config: memux.SourceConfig<Doc>) {
  return async () => {
    const receiveFn = await memux.createReceive(config);
  };
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

  return quadsToDocs(quads, Context.context);
}

// The result of this function is based on the expected input of
// the jsonld library to produce the quads we want.
export const quadsToDocs = async (quads: Array<Quad>, context: any): Promise<Doc> => {
  const nquads = Quad.toNQuads(quads);
  const doc = await jsonld.fromRDF(nquads);
  return Doc.expand(doc, context);
};

export const docToQuads = async (doc: Doc): Promise<Quad[]> => {
  const nquads = await jsonld.toRDF(doc, { format: 'application/nquads' });
  // console.log('Parsing nquads:', nquads);
  const lines = nquads.split('\n');
  lines.pop() // Remove empty newline
  const quads = lines.map(line => {
    const [ subject, predicate, object, label ] = line.split(/ (?=["<\.])/);
    const triple = { subject, predicate, object: (object[0] === "<" && object[object.length - 1] == ">") ? object : JSON.parse(object) };
    if (label !== '.') return { ...triple, label };
    return triple;
  });

  // We reverse the quads to preserve the order of the types (and possibly other things)
  return quads.reverse();
};
