import test from 'ava';

const expanded = require('./expanded');
const quads = require('./quads');
const compacted = require('./compacted');
const context = require('./context');

const nquads = `<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <https://knowledge.express/topic> <https://www.khanacademy.org/video/multiplying-negative-and-positive-fractions> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://knowledge.express/Resource> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/VideoObject> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/sourceOrganization> <https://www.khanacademy.org/> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/name> \"Multiplying positive and negative fractions\" <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/license> <http://creativecommons.org/licenses/by-nc-sa/3.0> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/image> <https://cdn.kastatic.org/googleusercontent/vkR4iP2PXl0SGkwmmpX-7N9mKNP7RWX8ilHMuROW745BJBvmp_eElCItbyPY-tweaVYgddFoNaaHpXSanPm92ZUS> <https://knowledge.express/engines/engine> .
<https://www.youtube.com/watch?v=pi3WWQ0q6Lc> <http://schema.org/description> \"See examples of multiplying and dividing fractions with negative numbers.\" <https://knowledge.express/engines/engine> .
`;

export {
  context,
  expanded,
  compacted,
  quads,
  nquads,
};

// This is a bit hacky, but ava complains otherwise
test('support', t => {
  t.pass();
});
