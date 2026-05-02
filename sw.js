/* ================================================
Service Worker — 百家樂趨勢分析 V6
快取所有資源以支援完全離線使用
================================================ */

const CACHE_NAME = ‘baccarat-v6-cache-v1’;

const ASSETS = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘./sw.js’
];

/* 安裝：預快取所有資源 */
self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(ASSETS))
.then(() => self.skipWaiting())
);
});

/* 啟動：刪除舊版快取 */
self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys
.filter(k => k !== CACHE_NAME)
.map(k => caches.delete(k))
)
).then(() => self.clients.claim())
);
});

/* 攔截請求：優先使用快取，失敗才嘗試網路 */
self.addEventListener(‘fetch’, event => {
event.respondWith(
caches.match(event.request).then(cached => {
if (cached) return cached;
return fetch(event.request)
.then(response => {
if (!response || response.status !== 200 || response.type === ‘opaque’) {
return response;
}
const clone = response.clone();
caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
return response;
})
.catch(() => caches.match(’./index.html’));
})
);
});
