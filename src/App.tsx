import { useEffect } from 'react';

import './App.css';
import logo from './assets/react-capture-events.svg';
import { useCaptureEvent } from '../lib/context/CaptureEventProvider';
import { CapturedEventsList } from '../lib/main';

function App() {
  const { addGlobalListeners } = useCaptureEvent();

  useEffect(() => {
    const removeListeners = addGlobalListeners(
      ['click'],
      ['component', 'event', 'action'],
    );

    return () => {
      removeListeners();
    };
  }, [removeEventListener]);

  return (
    <>
      <div className="container">
        <h1>React Capture Events</h1>

        <div className="icon-container">
          <img
            src={logo}
            className="react-capture-events-icon react-capture-events-icon:hover target-outer target-inner"
            alt="react-capture-events-icon"
          />
        </div>

        <div className="grid">
          <div className="card">
            <div className="card-header">
              <h2>Button Area</h2>
            </div>
            <div className="card-content">
              <button
                data-component="button"
                data-event="click"
                data-action="submit"
              >
                Submit
              </button>
              <button
                data-component="button"
                data-event="click"
                data-action="cancel"
                className="outline"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Input Area</h2>
            </div>
            <div className="card-content">
              <input
                data-component="input"
                data-event="input"
                data-action="update-name"
                placeholder="Enter your name"
              />
              <input
                data-component="input"
                data-event="input"
                data-action="update-email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Text Area</h2>
            </div>
            <div className="card-content">
              <textarea
                data-component="textarea"
                data-event="input"
                data-action="update-description"
                placeholder="Enter a description"
              ></textarea>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Checkbox Area</h2>
            </div>
            <div className="card-content">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  data-component="checkbox"
                  data-event="change"
                  data-action="accept-terms"
                />
                <label htmlFor="terms">Accept terms</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="newsletter"
                  data-component="checkbox"
                  data-event="change"
                  data-action="subscribe-newsletter"
                />
                <label htmlFor="newsletter">Subscribe to newsletter</label>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Radio Area</h2>
            </div>
            <div className="card-content">
              <div className="radio-group">
                <input
                  type="radio"
                  id="option1"
                  name="radio"
                  data-component="radio"
                  data-event="change"
                  data-action="select-option1"
                />
                <label htmlFor="option1">Option 1</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="option2"
                  name="radio"
                  data-component="radio"
                  data-event="change"
                  data-action="select-option2"
                />
                <label htmlFor="option2">Option 2</label>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Select Area</h2>
            </div>
            <div className="card-content">
              <select
                data-component="select"
                data-event="change"
                data-action="choose-color"
              >
                <option value="">Select a color</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <CapturedEventsList />
    </>
  );
}

export default App;
