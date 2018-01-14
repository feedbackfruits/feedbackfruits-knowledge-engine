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

    const compactedDoc = await compactDoc(data, {});

    return sendFn({ action, key, data: compactedDoc });
  };
}

export function createReceive(config: memux.SourceConfig<Doc>) {
  return async () => {
    const receiveFn = await memux.createReceive(config);
  };
}

export async function compactDoc(ld: Object, context: Object): Promise<Doc> {
  const res = await jsonld.compact(await expandDoc(ld, context), context);

  // Here we strip the context from the compacted result
  delete res["@context"];

  return res;
}

export async function expandDoc(ld: Object, context: Object): Promise<Doc> {
  return jsonld.expand({ "@context": context, "@graph": ld });
}

// The result of this function is based on the expected input of
// the jsonld library to produce the quads we want.
export const quadsToDocs = async (quads: Array<Quad>, context: Object): Promise<Doc> => {
  const nquads = quadsToNQuads(quads);
  const doc = await jsonld.fromRDF(nquads);
  return expandDoc(doc, context);

  // return Object.values(quads.reduce((memo, quad) => {
  //   let { subject, predicate, object } = quad;
  //
  //   // Hacky hacks are hacky
  //   if (predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') predicate = '@type';
  //
  //   return {
  //     ...memo,
  //     [decodeIRI(subject)]: {
  //       ...(memo[decodeIRI(subject)] || { '@id': decodeIRI(subject) }),
  //       [decodeIRI(predicate)]: [
  //         ...((memo[decodeIRI(subject)] && memo[decodeIRI(subject)][decodeIRI(predicate)]) || []),
  //         object
  //       ]
  //     }
  //   };
  // }, {}));
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

export const quadsToNQuads = (quads: Quad[]): string => {
  return quads.map(quad => {
    const { subject, predicate, object, label } = quad;
    return `${subject} ${predicate} ${isIRI(object) ? object : JSON.stringify(object)} ${label ? label : ''} .\n`;
  }).join('');
};
