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
  export function isQuad(quad: object): quad is Quad {
    return quad != null &&
    typeof quad === 'object' &&
    typeof quad['subject'] === 'string' &&
    typeof quad['predicate'] === 'string' &&
    typeof quad['object'] === 'string';
  }

  export function compare(a: Quad, b: Quad): number {
    const compareSubjects = a.subject.localeCompare(b.subject);
    const comparePredicates = a.predicate.localeCompare(b.predicate);
    const compareObjects = a.object.localeCompare(b.object);
    const compareLabels = a.label.localeCompare(b.label);

    return (
      compareSubjects !== 0 ? compareSubjects :
      comparePredicates !== 0 ? comparePredicates :
      compareObjects !== 0 ? compareObjects :
      compareLabels !== 0 ? compareLabels :
      0);

  }

  export function fromNQuads(nquads: NQuads): Quad[] {
    // console.log('fromNQuads:', nquads);
    const parser = n3.Parser();
    // console.log('Parsing nquads with n3:', JSON.stringify(nquads));
    const quads = (<n3.Triple[]><any>parser.parse(nquads, null)).map(({ subject, predicate, object, graph}) => {
      // console.log('Object:', JSON.stringify(object));

      if (Helpers.isLiteral(object)) {
        // console.log('Doing hacky stuff...')
        try {
          object = JSON.parse(object.replace(/"/g, `\"`)
                      .replace(/'/g, `\'`)
                      .replace(/\n/g, "\\n"));
        } catch(e) {
          console.log('Hacky stuff broke on:', object);
          console.error(e);
        }
      }

      return {
        subject,
        predicate,
        object,
        label: graph
      }
    });

    return quads;
  }

  export const toNQuads = (quads: Quad[]): NQuads => {
    return quads.map(quad => {
      const { subject, predicate, object, label } = quad;
      return `${Helpers.iriify(subject)} ${Helpers.iriify(predicate)} ${Helpers.encodeRDF(object)} ${label ? Helpers.iriify(label) : ''} .\n`;
    }).join('');
  };

}

export default Quad;
