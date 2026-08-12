/* 우리 앱 런처 — 설치(PWA) + 오프라인. 네트워크 우선이라 항상 최신을 받는다 */
var CACHE='ourapps-v1';
var SHELL=['/','/index.html','/manifest.webmanifest','/privacy.html','/terms.html',
           '/icon-192.png','/icon-512.png','/icon-maskable-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).catch(function(){}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var req=e.request; if(req.method!=='GET')return;
  if(new URL(req.url).origin!==location.origin)return;
  e.respondWith(fetch(req).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});return res;})
    .catch(function(){return caches.match(req).then(function(r){return r||caches.match('/index.html');});}));
});
