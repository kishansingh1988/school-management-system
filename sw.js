// Service Worker for Progressive Web App (PWA) Offline Caching & Background Operations
const CACHE_NAME = "school-erp-pwa-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/js/app.js",
  "/js/store.js",
  "/js/utils/seedData.js",
  "/js/utils/formatters.js",
  "/js/utils/pdfGenerator.js",
  "/js/components/AdminDashboard.js",
  "/js/components/TeacherDashboard.js",
  "/js/components/StudentDashboard.js",
  "/js/components/ParentDashboard.js",
  "/js/components/StudentDirectory.js",
  "/js/components/TeacherDirectory.js",
  "/js/components/AttendanceModule.js",
  "/js/components/HomeworkModule.js",
  "/js/components/GradebookModule.js",
  "/js/components/TimetableModule.js",
  "/js/components/FeeModule.js",
  "/js/components/NoticeModule.js",
  "/js/components/SettingsModule.js",
  "/js/components/SuperAdminModule.js",
  "/js/components/TransportModule.js",
  "/js/components/LibraryModule.js",
  "/js/components/PayrollLeavesModule.js",
  "/js/components/AuthModal.js",
  "/icons/icon.svg"
];

// Install Event: Cache Core App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA Service Worker] Pre-caching offline assets");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[PWA Service Worker] Pre-cache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[PWA Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network first with Cache fallback for maximum freshness
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response and cache it
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }
        });
      })
  );
});

// Push Notification Listener for Real-Time Parent & Teacher Alerts
self.addEventListener("push", (event) => {
  let data = { title: "Apex School Alert", body: "New update from school." };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/index.html"
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || "/index.html")
  );
});
