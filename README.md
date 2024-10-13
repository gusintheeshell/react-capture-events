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

## 📊 Possible Use Cases

The React Capture Events library can be applied in various scenarios where capturing, visualizing, and managing events is required. The implementation of these use cases should be done in conjunction with appropriate tools and workflows to handle specific requirements, such as logging, analysis, or integration with other systems. Below are some potential use cases:

1. **Application Debugging and Monitoring**
   Capture user interactions and system events in real-time to simplify debugging and application monitoring during development.

2. **User Behavior Analysis**
   Collect user interaction data, such as clicks and page navigation, to gain insights into user behavior and enhance the user experience.

3. **Automated Testing**
   Capture events during automated tests to verify if all expected interactions are triggered correctly during integration or end-to-end testing.

4. **Event Auditing and Logging**
   Implement event logging for compliance and security, maintaining a detailed history of user actions, such as configuration changes or access to sensitive data.

5. **Feedback and Customer Support**
   Provide detailed event logs to support teams, helping to resolve user issues more efficiently by capturing relevant events, including errors.

6. **Performance Analysis**
   Capture performance-related events like page and component load times to identify bottlenecks and areas for improvement.

7. **Educational Applications**
   Track user progress and interactions on educational platforms to provide personalized learning experiences and feedback to learners.

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
