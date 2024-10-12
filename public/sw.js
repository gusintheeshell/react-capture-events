let events = [];

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'LOG_EVENT') {
    const newEvent = {
      eventName: event.data.eventName,
      eventData: event.data.eventData,
      timestamp: new Date().toISOString(),
    };

    events.push(newEvent);

    if (events.length > 100) {
      events.shift();
    }
  }

  if (event.data.type === 'GET_EVENTS') {
    event.source.postMessage({ type: 'EVENTS_LIST', events });
  }

  if (event.data.type === 'CLEAR_EVENTS') {
    events = [];
    event.source.postMessage({ type: 'EVENTS_CLEARED' });
  }
});
