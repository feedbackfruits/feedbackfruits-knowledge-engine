import { promises as jsonld } from 'jsonld';
import * as _Context from 'feedbackfruits-knowledge-context';
import * as Helpers from './helpers';
import Quad from './quad';

// export type Doc = {
//   '@id': string
// };

export type Doc = object;
export type Context = typeof _Context.context;

export module Doc {
  export function isDoc(doc: object): doc is Doc {
    return doc != null && typeof doc['@id'] === 'string';
  };

  export function _keys(doc: Doc): Object {
    if (doc instanceof Array) return doc.reduce((memo, d) => {
      return { ...memo, ..._keys(d) };
    }, {});

    if (typeof doc === 'object') return Object.keys(doc).reduce((memo, key) => {
      // Skip JSON-LD keys
      if (key[0] !== "@") memo[key] = true;

      const value = doc[key];
      return { ...memo, ..._keys(value)};
      // // if (typeof key === 'object')
      // return memo;
    }, {});

    return {};
  }

  export function keys(doc: Doc): string[] {
    return Object.keys(_keys(doc));
  }

  export async function validate(doc: Doc, context: Context): Promise<boolean> {
    // const compacted = await compact(doc, context);
    const flattened = await flatten(doc, context);
    // console.log('Flattened:', flattened);
    const docKeys = keys(flattened);
    const isValid = docKeys.reduce((memo, key) => {
      if (Helpers.isURI(key)) throw new Error(`Doc contains invalid key "${key}".`);
      return memo;
    }, true);
    return isValid;
  }

  export async function isValid(doc: Doc, context: Context) {
    try {
      return validate(doc, context);
    } catch(e) {
      return false;
    }
  }

  export async function compact(doc: Doc, context: Context): Promise<Doc> {
    const res = await jsonld.compact(await expand(doc, context), context);

    // Here we strip the context from the compacted result
    delete res["@context"];

    return res;
  }

  export async function expand(doc: Doc, context: Context): Promise<Doc> {
    return [].concat(jsonld.expand({ "@context": context, "@graph": doc }))[0];
  }

  export async function flatten(doc: Doc, context: Context): Promise<Doc[]> {
    const expanded = await expand(await compact(doc, context), context);
    // console.log(JSON.stringify(expanded));
    const quads = await toQuads(expanded);
    // console.log(quads);
    // const ids = quads.reduce((memo, { subject }) => ({ [Helpers.decodeIRI(subject)]: true }), {});
    // console.log('subjects:', ids);
    // return [ doc ];


    // console.log("Stripping quads", quads);
    // We strip the labels here for a combination of two reasons: we don't need them yet and it makes flattening difficult
    const strippedOfLabel = quads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));

    // console.log("Stripped of label:", strippedOfLabel)
    const strippedDoc = await fromQuads(strippedOfLabel, context);

    // console.log("Flattening stripped doc:", strippedDoc);
    const flattened = await jsonld.flatten(strippedDoc);
    const compacted = Promise.all(flattened.map(doc => compact(doc, context)));

    return compacted;
  }

  export async function unflatten(doc: Doc, context: Context): Promise<Doc> {
    throw new Error('Not implemented.');
    // return null;
  }


  export async function fromQuads(quads: Array<Quad>, context: any): Promise<Doc> {
    const nquads = Quad.toNQuads(quads);
    const doc = await jsonld.fromRDF(nquads);
    return Doc.expand(doc, context);
  };

  export async function toQuads(doc: Doc): Promise<Quad[]> {
    const nquads = await jsonld.toRDF(doc, { format: 'application/nquads' });
    return Quad.fromNQuads(nquads).reverse();
  };

  // export async function encode(doc: Doc): Promise<Doc> {
  //   return null;
  //   // console.log('Mapping with send');
  //   // if (!(typeof doc["@id"] === 'string')) throw new Error(`Trying to send a doc without an @id`);
  // }
  //
  // export async function decode(doc: Doc): Promise<Doc> {
  //   return null;
  // }
}

export default Doc;
