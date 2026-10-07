const CACHE='bunayya-v3';
const SHELL=['./','index.html','logo.png','icon-512.png','icon-maskable-512.png','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  const fresh=/data\.js|index\.html|\/$/.test(new URL(e.request.url).pathname);
  e.respondWith(fresh
    ? fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request))
    : caches.match(e.request).then(r=>r||fetch(e.request)));
});
