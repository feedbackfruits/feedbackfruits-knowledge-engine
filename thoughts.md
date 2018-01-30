- [x] Annotate video with captions --> yt-annotator
- [x] Merge captions to text --> text-annotator (do we have the captions? get them from api, maybe in engine)
- [x] Tag and annotate text --> text-annotator

- [ ] Cache all the things --> Expose from engine base?
- [ ] Expose HTTP endpoint --> Again, something with the engine
- [ ] Call endpoint from frontend --> Should this be aggregated in api? Probably...
- [ ] Query with all of this info --> api, search-broker

Is the bus just a notification mechanism? It used to be (when it was just quads), but now it's entire docs, with their 'relationships' embedded by id at the least. That allows us to reason not just about the doc but what it has related to it. The bus gives us deduplication of things by key, in this case docs by id. That only works for single docs though, so no graphs. This makes it difficult to combine the labeled quads in Cayley with the bus, because it effectively forces a doc to be present entirely within one label or have data duplication.

And then there is provenance, which tells us how things came to be. https://dvcs.w3.org/hg/rdf/raw-file/default/rdf-spaces/index.html#

Are documents ever in more than one space?


- [ ] Flatten before sending
- [ ] Compact before sending
- [ ] Expand after receiving
- [ ] Unflatten (?) after receiving? Basically, take the flattened document, get all of the ids for relationships and get all of those documents. Maybe let the engines handle this themselves.

- [ ] Offer global (derived) measures from engine? (count, centrality) Aggregate in api? Or just build an annotator for it so it can be done on bus-level?

How to store in ES? Index can have multiple types. Filter by type, search by document, relationships with id, basically store flattened compacted docs.

The point of compacting the docs before sending is to use less characters to encode the same information. The point of flattening the docs before sending is to avoid redundancy on the bus. The unflattening is needed because some engines require more context than just a document, i.e. the annotations and tags and their entities.

Some engines might be better off not dealing with JSON-LD. Since the docs are compacted (and expanded before that), it can be verified that everything is the doc is compatible with the context. That would allow docs to call send with plain JSON that can still be contextualized (possible with mapping of "@id" and "@type").

Engines:
- Can send and/or receive
- Can react to the data they receive
- Can send data whenever
- Be started and stopped
- Have a speed
- Have a progress/status
- Have side effects

Data:
- Is streamed through Kafka
- Is stored in Cayley
- Is often incomplete (both with quads and docs)
- Is sometimes measured globally (count, centrality)
- Can be re-contextualized/framed
