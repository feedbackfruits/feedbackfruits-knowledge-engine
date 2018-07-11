import test from 'ava';
import * as Captions from '../lib/captions';
import * as Support from './support';

test('it parses xml captions', async t => {
  const url = "https://video.google.com/timedtext?v=pi3WWQ0q6Lc&lang=en";
  const captions = Support.captions.xml;
  console.log('Captions:', captions);
  const result = await Captions.XML.parse(url, captions);
  console.log('Result:', JSON.stringify(result));
  return t.deepEqual(result, Support.captions.xmlParsed);
});
