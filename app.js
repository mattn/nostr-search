const client = new meilisearch.Meilisearch({
  host: "https://meilisearch.compile-error.net",
  apiKey: "988eb54177979e53e939c1075f77a8305bfbe2fda147566432d79252ff9c9084",
});
const nameMap = {};
document.querySelector('#search').addEventListener('input', (e) => {
  if (e.target.value === '') {
    document.querySelector('#hits').innerHTML = '';
    return;
  }
  client.index('events').search(e.target.value).then((res) => {
    const container = document.querySelector('#hits');
    container.innerHTML = '';
    res.hits.forEach((hit) => {
      const elem = document.createElement('div');
      elem.className = 'card';
      elem.innerHTML = `
        <div class="card-content">
          <div><img class="icon" src="https://nostr-nullpoga.compile-error.net/icon/${hit.pubkey}"/> <div class="name"></div></div>
          <div class="card-text">${hit.content}</div>
          <a href="https://njump.compile-error.net/${hit.kind === 0 ? globalThis.NostrTools.nip19.npubEncode(hit.id) : globalThis.NostrTools.nip19.noteEncode(hit.id)}">Source</a>
        </div>
      `;
      if (!nameMap[hit.pubkey]) {
        fetch((`https://nostr-nullpoga.compile-error.net/profile/${hit.pubkey}`)).then((resp) => resp.json()).then((profile) => {
          if (profile && profile.name) {
            nameMap[hit.pubkey] = profile.name;
          } else {
            nameMap[hit.pubkey] = hit.pubkey.slice(0, 8);
          }
          elem.querySelector('.name').textContent = nameMap[hit.pubkey];
        }).catch(() => {
          nameMap[hit.pubkey] = hit.pubkey.slice(0, 8);
          elem.querySelector('.name').textContent = nameMap[hit.pubkey];
        });
      } else {
        elem.querySelector('.name').textContent = nameMap[hit.pubkey];
      }
      container.appendChild(elem);
    });
  }).catch((err) => {
    console.error(err);
  });
}, false);
