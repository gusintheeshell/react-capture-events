# React Capture Events

<div align="center"> <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/react-capture-events-hPdo0AepAc4kCSiALhSoJOk17E138v.svg" alt="React Capture Events Logo" width="200" height="200"> </div>

A React library to capture and display events in a user-friendly interface. This library provides components to log, view, and manage events in your React application.

## 🚀 Features

- Capture and display events in real-time
- Switch between individual event view and table view
- Clear all captured events
- Responsive and interactive UI

## 📦 Installation

Install the library using npm:

```bash
npm install react-capture-events
```

or yarn:

```bash
yarn add react-capture-events
```

## 🛠 Usage

### Basic Setup

1. **Register the Service Worker**

   Register the service worker to enable event capturing:

   ```jsx
   import { registerServiceWorker } from 'react-capture-events'

   registerServiceWorker()
   ```

2. **Wrap Your Application with the Provider**

   Wrap your application with the CaptureEventProvider to provide context for capturing events:

   ```jsx
   import React from 'react'
   import ReactDOM from 'react-dom'
   import { CaptureEventProvider } from 'react-capture-events'
   import App from './App'

   ReactDOM.render(
     <CaptureEventProvider>
       <App />
     </CaptureEventProvider>,
     document.getElementById('root'),
   )
   ```

3. **Use the CapturedEventsList Component**

   Add the CapturedEventsList component to your application to display the captured events:

   ```jsx
   import React from 'react'
   import { CapturedEventsList } from 'react-capture-events'

   const App = () => (
     <div>
       <h1>My Application</h1>
       <CapturedEventsList />
     </div>
   )

   export default App
   ```

## 📝 Capturing Events

To capture events, send messages to the service worker:

```javascript
navigator.serviceWorker.controller.postMessage({
  type: 'LOG_EVENT',
  eventName: 'MyEvent',
  eventData: { key: 'value' },
})
```

## 🗑 Clearing Events

To clear all captured events, send a `CLEAR_EVENTS` message to the service worker:

```javascript
navigator.serviceWorker.controller.postMessage({
  type: 'CLEAR_EVENTS',
})
```

## 📚 Examples

### Basic Example

```jsx
import React from 'react'
import { CaptureEventProvider, CapturedEventsList } from 'react-capture-events'

function App() {
  return (
    <CaptureEventProvider>
      <div>
        <h1>Event Capture Example</h1>
        <CapturedEventsList />
      </div>
    </CaptureEventProvider>
  )
}

export default App
```

### Advanced Example

```jsx
import React, { useEffect } from 'react'
import {
  CaptureEventProvider,
  CapturedEventsList,
  captureEvent,
} from 'react-capture-events'

function App() {
  useEffect(() => {
    // Simulate capturing an event
    captureEvent({ type: 'click', message: 'Button clicked' })
  }, [])

  return (
    <CaptureEventProvider>
      <div>
        <h1>Advanced Event Capture Example</h1>
        <button
          onClick={() =>
            captureEvent({ type: 'click', message: 'Button clicked' })
          }
        >
          Click Me
        </button>
        <CapturedEventsList />
      </div>
    </CaptureEventProvider>
  )
}

export default App
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
