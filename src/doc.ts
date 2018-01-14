import * as Context from 'feedbackfruits-knowledge-context';

export type Doc = {
  '@id': string
};

export const isDoc = (doc: object): doc is Doc => {
  return doc != null && typeof doc['@id'] === 'string';
};

export default Doc;
