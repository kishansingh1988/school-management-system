// Service Worker for Progressive Web App (PWA) Offline Caching & Background Operations
const CACHE_NAME = "school-erp-pwa-v2.2";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/custom.css?v=2.2",
  "./js/app.js?v=2.2",
  "./js/store.js?v=2.2",
  "./js/utils/seedData.js?v=2.2",
  "./js/utils/formatters.js?v=2.2",
  "./js/utils/pdfGenerator.js?v=2.2",
  "./js/components/AdminDashboard.js?v=2.2",
  "./js/components/TeacherDashboard.js?v=2.2",
  "./js/components/StudentDashboard.js?v=2.2",
  "./js/components/ParentDashboard.js?v=2.2",
  "./js/components/StudentDirectory.js?v=2.2",
  "./js/components/TeacherDirectory.js?v=2.2",
  "./js/components/AttendanceModule.js?v=2.2",
  "./js/components/HomeworkModule.js?v=2.2",
  "./js/components/GradebookModule.js?v=2.2",
  "./js/components/TimetableModule.js?v=2.2",
  "./js/components/FeeModule.js?v=2.2",
  "./js/components/NoticeModule.js?v=2.2",
  "./js/components/SettingsModule.js?v=2.2",
  "./js/components/SuperAdminModule.js?v=2.2",
  "./js/components/TransportModule.js?v=2.2",
  "./js/components/LibraryModule.js?v=2.2",
  "./js/components/PayrollLeavesModule.js?v=2.2",
  "./js/components/AuthModal.js?v=2.2",
  "./icons/icon.svg"
];

// Install Event: Cache Core App Shell & Skip Waiting
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA Service Worker] Pre-caching v2.2 assets");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[PWA Service Worker] Pre-cache warning:", err);
      });
    })
  );
});

// Activate Event: Clean up all old cache versions immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[PWA Service Worker] Purging old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First strategy with automatic cache fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html")) {
            return caches.match("./index.html") || caches.match("index.html");
          }
        });
      })
  );
});

// Push Notification Listener
self.addEventListener("push", (event) => {
  let data = { title: "Apex School Alert", body: "New update from school." };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Apex School Alert", body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: "./icons/icon-192.png",
    badge: "./icons/icon.svg",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "./",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "./");
      }
    })
  );
});
