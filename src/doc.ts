import { promises as jsonld } from 'jsonld';
import * as _Context from 'feedbackfruits-knowledge-context';
import * as Helpers from './helpers';
import Quad from './quad';

// export type Doc = {
//   '@id': string
// };

export type Doc = object;
export type Context = typeof _Context.context;
export type Frame = {
  "@context": Context
} & Doc;

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

  export async function compare(a: Doc, b: Doc, context: Context = { "@context": [] }): Promise<number> {
    // Expanding factors out the context
    const expandedA = await expand(a, context);
    const expandedB = await expand(b, context);

    // Quads can be sorted
    const quadsA = await toQuads(expandedA);
    const quadsB = await toQuads(expandedB);

    const sortedQuadsA = quadsA.sort(Quad.compare);
    const sortedQuadsB = quadsB.sort(Quad.compare);

    // String can be easily compared
    const nquadsA = Quad.toNQuads(sortedQuadsA);
    const nquadsB = Quad.toNQuads(sortedQuadsB);

    return nquadsA.localeCompare(nquadsB);
  }

  export async function compact(doc: Doc, context: Context): Promise<Doc> {
    const res = await jsonld.compact(await expand(doc, context), context);

    // Here we strip the context from the compacted result
    delete res["@context"];

    return res;
  }

  export async function expand(doc: Doc, context: Context): Promise<Doc[]> {
    return [].concat(await jsonld.expand({ "@context": context, "@graph": doc }));
  }

  export async function flatten(doc: Doc, context: Context): Promise<Doc[]> {
    const expanded = await expand(await compact(doc, context), context);
    // console.log(JSON.stringify(expanded));
    const quads = await toQuads(expanded);
    // console.log(quads);
    // const objects = Object.keys(quads.reduce((memo, { object }) => ({ ...memo, [Helpers.decodeIRI(object)]: true }), {}));
    // console.log('objects:', objects.join('\n'));
    // return [ doc ];


    // console.log("Stripping quads", quads);
    // We strip the labels here for a combination of two reasons: we don't need them yet and it makes flattening difficult
    const strippedOfLabel = quads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));

    // console.log("Stripped of label:", strippedOfLabel)
    const strippedDoc = await fromQuads(strippedOfLabel, context);

    // console.log("Flattening stripped doc:", strippedDoc);
    const flattened: object[] = await jsonld.flatten(strippedDoc);
    const compacted = Promise.all(flattened.map(doc => compact(doc, context)));

    return compacted;
  }

  export async function frame(graph: Doc[], frame: Frame): Promise<Doc[]> {
    const flattened = await flatten({ "@graph": graph }, frame["@context"]);
    const expanded = await expand(flattened, frame["@context"]);
    const framed = await jsonld.frame(expanded, frame);
    // return flattened;
    // Strip the context from the framed result
    // delete framed["@context"];

    return [].concat(framed["@graph"]);
  }

  export async function fullfilsFrame(graph: Doc[], _frame: Frame): Promise<boolean> {
    const framed = await frame(graph , _frame);
    if (framed.length === 0) return false;

    const reframed = await frame(framed, _frame);
    const compared = await compare(framed, reframed, _frame["@context"]);
    // console.log('Compared frame lengths:', framed.length, reframed.length);
    return compared === 0;
  }

  // export async function unflatten(doc: Doc, context: Context): Promise<Doc> {
  //   throw new Error('Not implemented.');
  //   // return null;
  // }


  export async function fromQuads(quads: Array<Quad>, context: any): Promise<Doc> {
    const nquads = Quad.toNQuads(quads);
    // console.log('fromQuads:', nquads);
    const doc = await jsonld.fromRDF(nquads, { useNativeTypes: true });
    return Doc.expand(doc, context);
  };

  export async function toQuads(doc: Doc): Promise<Quad[]> {
    const nquads = await jsonld.toRDF(doc, { format: 'application/nquads' });
    // console.log('Nquads from jsonld:', JSON.stringify(nquads));
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
