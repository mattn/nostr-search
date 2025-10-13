const client = new meilisearch.Meilisearch({
  host: "https://meilisearch.compile-error.net",
  apiKey: "988eb54177979e53e939c1075f77a8305bfbe2fda147566432d79252ff9c9084",
});
document.querySelector('#searchbox').addEventListener('input', async (e) => {
  if (e.target.value === '') {
    document.querySelector('#hits').innerHTML = '';
    return;
  }
  client.index('events').search(e.target.value).then((res) => {
    const hitsContainer = document.querySelector('#hits');
    hitsContainer.innerHTML = '';
    res.hits.forEach((hit) => {
      const hitElement = document.createElement('div');
      hitElement.className = 'hit';
      hitElement.innerHTML = `
        <div class="hit-content">
          <div><img class="icon" src="https://nostr-nullpoga.compile-error.net/icon/${hit.pubkey}"/></div>
          <div>${hit.content}</div>
          <a href="https://njump.compile-error.net/${hit.kind === 0 ? globalThis.NostrTools.nip19.npubEncode(hit.id) : globalThis.NostrTools.nip19.noteEncode(hit.id)}">Source</a>
        </div>
      `;
      hitsContainer.appendChild(hitElement);
    });
  }).catch((err) => {
    console.error(err);
  });
}, false);
