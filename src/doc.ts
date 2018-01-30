import { promises as jsonld } from 'jsonld';
import * as _Context from 'feedbackfruits-knowledge-context';

// export type Doc = {
//   '@id': string
// };

export type Doc = object;
export type Context = typeof _Context.context;

export module Doc {
  export const isDoc = (doc: object): doc is Doc => {
    return doc != null && typeof doc['@id'] === 'string';
  };

  export async function compact(doc: Doc, context: Context): Promise<Doc> {
    const res = await jsonld.compact(await expand(doc, context), context);

    // Here we strip the context from the compacted result
    delete res["@context"];

    return res;
  }

  export async function expand(doc: Doc, context: Context): Promise<Doc> {
    return jsonld.expand({ "@context": context, "@graph": doc });
  }

  export async function flatten(doc: Doc, context: Context): Promise<Doc[]> {
    return [].concat(jsonld.flatten({ "@context": context, "@graph": doc }));
  }

  export async function unflatten(doc: Doc, context: Context): Promise<Doc> {
    throw new Error('Not implemented.');
    // return null;
  }

// // The result of this function is based on the expected input of
// // the jsonld library to produce the quads we want.
// export const quadsToDocs = async (quads: Array<Quad>, context: Context): Promise<Doc> => {
//   const nquads = quadsToNQuads(quads);
//   const doc = await jsonld.fromRDF(nquads);
//   return expand(doc, context);
// };
//
// export const docToQuads = async (doc: Doc): Promise<Quad[]> => {
//   const nquads = await jsonld.toRDF(doc, { format: 'application/nquads' });
//   // console.log('Parsing nquads:', nquads);
//   const lines = nquads.split('\n');
//   lines.pop() // Remove empty newline
//   const quads = lines.map(line => {
//     const [ subject, predicate, object, label ] = line.split(/ (?=["<\.])/);
//     const triple = { subject, predicate, object: (object[0] === "<" && object[object.length - 1] == ">") ? object : JSON.parse(object) };
//     if (label !== '.') return { ...triple, label };
//     return triple;
//   });
//
}

export default Doc;
