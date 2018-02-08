import * as n3 from 'n3';
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


export function fromNQuads(nquads: NQuads): Quad[] {
  const parser = n3.Parser();
  const quads = (<n3.Triple[]><any>parser.parse(nquads, null)).map(({ subject, predicate, object, graph}) => {
    return {
      subject,
      predicate,
      object,
      label: graph
    }
  }); //.reverse();

  return quads;
}

export const toNQuads = (quads: Quad[]): NQuads => {
  return quads.map(quad => {
    const { subject, predicate, object, label } = quad;
    return `${Helpers.iriify(subject)} ${Helpers.iriify(predicate)} ${Helpers.encodeIRI(object)} ${label ? Helpers.iriify(label) : ''} .\n`;
  }).join('');
};

}

export default Quad;
