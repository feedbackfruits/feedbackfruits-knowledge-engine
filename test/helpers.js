import test from 'ava';
import * as Helpers from '../lib/helpers';

const expanded = require('./support/expanded');
const quads = require('./support/quads');
const compacted = require('./support/compacted');
const context = require('./support/context');

const nquads = `<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <https://knowledge.express/topic> <https://www.khanacademy.org/video/multiplying-negative-and-positive-fractions> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://knowledge.express/Resource> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/VideoObject> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/sourceOrganization> <https://www.khanacademy.org/> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/name> \"Multiplying positive and negative fractions\" <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/license> <http://creativecommons.org/licenses/by-nc-sa/3.0> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/image> <https://cdn.kastatic.org/googleusercontent/vkR4iP2PXl0SGkwmmpX-7N9mKNP7RWX8ilHMuROW745BJBvmp_eElCItbyPY-tweaVYgddFoNaaHpXSanPm92ZUS> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/description> \"See examples of multiplying and dividing fractions with negative numbers.\" <https://knowledge.express/engines/engine> .
`

test('quadsToDocs', t => {
  return Helpers.quadsToDocs(quads, context).then(res => {
    return t.deepEqual(res, expanded);
  })
});

test('compactDoc: it compacts', t => {
  return Helpers.compactDoc(expanded, context).then(res => {
    return t.deepEqual(res, compacted);
  })
});

test('compactDoc: you only compact once', t => {
  return Helpers.compactDoc(compacted, context).then(res => {
    return t.deepEqual(res, compacted);
  })
});

test('expandDoc: it expands', t => {
  return Helpers.expandDoc(compacted, context).then(res => {
    return t.deepEqual(res, expanded);
  })
});

test('expandDoc: you only expand once', t => {
  return Helpers.expandDoc(expanded, context).then(res => {
    return t.deepEqual(res, expanded);
  })
});

test('docToQuads', async (t) => {
  return Helpers.docToQuads(expanded).then(res => {
    // console.log(JSON.stringify(res));
    return t.deepEqual(res , quads);
  })
});

test('quadsToNQuads', t => {
  const res = Helpers.quadsToNQuads(quads);
  // console.log(JSON.stringify(res));
  return t.deepEqual(res, nquads);
})
