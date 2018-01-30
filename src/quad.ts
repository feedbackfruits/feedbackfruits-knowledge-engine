import * as Helpers from './helpers';

export type NQuads = string;

export type Quad = {
  subject: string,
  predicate: string,
  object: string,
  label?: string
};

export module Quad {
  export const isQuad = (quad: object): quad is Quad => {
    return quad != null &&
    typeof quad === 'object' &&
    typeof quad['subject'] === 'string' &&
    typeof quad['predicate'] === 'string' &&
    typeof quad['object'] === 'string';
  };


export const toNQuads = (quads: Quad[]): NQuads => {
  return quads.map(quad => {
    const { subject, predicate, object, label } = quad;
    return `${subject} ${predicate} ${Helpers.isIRI(object) ? object : JSON.stringify(object)} ${label ? label : ''} .\n`;
  }).join('');
};

}

export default Quad;
