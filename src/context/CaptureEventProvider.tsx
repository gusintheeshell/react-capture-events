import { createContext, useContext, useCallback, ReactNode, FC } from "react";
import { CapturedEventsList } from "../components/CapturedEventsList";

/**
 * @interface EventContextType
 * @template E - The type of the event name, defaults to string.
 * @template D - The type of the event data, defaults to a record with string keys and any values.
 *
 * @property handleUserAction - A function to handle user actions.
 * @param eventName - The name of the event.
 * @param eventData - The data associated with the event.
 *
 * @property handleResponseAction - A function to handle response actions.
 * @param eventName - The name of the event.
 * @param eventData - The data associated with the event.
 * @param error - An optional boolean indicating if there was an error.
 *
 * @property addGlobalListeners - A function to add global event listeners.
 * @param eventTypes - An array of event types to listen for.
 * @param selector - A CSS selector to target elements.
 * @param dataAttributes - An array of data attributes to include.
 * @returns A function to remove the added event listeners.
 */
interface EventContextType<E = string, D = Record<string, any>> {
  handleUserAction: (eventName: E, eventData: D) => void;
  handleResponseAction: (eventName: E, eventData: D, error?: boolean) => void;
  addGlobalListeners: (
    eventTypes: string[],
    dataAttributes: string[],
    selector?: string
  ) => () => void;
}

interface EventProviderProps {
  children: ReactNode;
}

const EventContext = createContext<EventContextType<any, any> | undefined>(
  undefined
);

/**
 * EventProvider component that provides event handling capabilities to its children.
 *
 * @param {EventProviderProps} props - The properties for the EventProvider component.
 * @param {React.ReactNode} props.children - The child components that will be wrapped by the EventProvider.
 *
 * @returns {JSX.Element} The EventProvider component.
 *
 * @description
 * This component sets up event handling for user actions and response actions. It uses the Context API to provide
 * event handling functions to its children. The event handling functions include:
 *
 * - `handleUserAction`: Sends a user action event with the specified event name and data.
 * - `handleResponseAction`: Sends a response action event with the specified event name, data, and an optional error flag.
 * - `addGlobalListeners`: Adds global event listeners for specified event types and a selector, and extracts data attributes
 *   from the event target to send as event data.
 *
 * The event data is sent to a service worker if it is available and controlled.
 *
 * @example
 * ```tsx
 * import { EventProvider } from './context/CaptureEventProvider';
 *
 * const App = () => (
 *   <EventProvider>
 *     <YourComponent />
 *   </EventProvider>
 * );
 * ```
 */
export const EventProvider: FC<EventProviderProps> = ({
  children,
}: EventProviderProps): JSX.Element => {
  const sendEvent = useCallback(
    (eventName: string, eventData: Record<string, any>) => {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "LOG_EVENT",
          eventName,
          eventData,
        });
      }
    },
    []
  );

  /**
   * Handles user actions by sending an event with the specified name and data.
   *
   * @param {string} eventName - The name of the event to send.
   * @param {Record<string, any>} eventData - The data associated with the event.
   *
   * @example
   * ```tsx
   * const { handleUserAction } = useCaptureEvent();
   * handleUserAction('button_click', { buttonId: 'submit' });
   * ```
   */
  const handleUserAction = useCallback(
    (eventName: string, eventData: Record<string, any>) => {
      sendEvent(eventName, eventData);
    },
    [sendEvent]
  );

  /**
   * Handles the response action by sending an event with the provided event name and data.
   *
   * @param eventName - The name of the event to be sent.
   * @param eventData - The data associated with the event.
   * @param error - Optional flag indicating if there was an error. Defaults to false.
   *
   * @example
   * ```tsx
   * const { handleResponseAction } = useCaptureEvent();
   * handleResponseAction('api_response', { status: 200 }, false);
   * ```
   */
  const handleResponseAction = useCallback(
    (eventName: string, eventData: Record<string, any>, error = false) => {
      sendEvent(eventName, { ...eventData, error });
    },
    [sendEvent]
  );

  /**
   * Adds global event listeners to the document for specified event types.
   * When an event is triggered, it checks if the event target matches the given selector.
   * If a match is found, it collects specified data attributes from the target element
   * and calls the `handleUserAction` function with the event name and collected data.
   *
   * @param {string[]} eventTypes - An array of event types to listen for (e.g., 'click', 'mouseover').
   * @param {string[]} dataAttributes - An array of data attribute names to collect from the event target.
   * @param {string} selector - A CSS selector to match the event target.
   * @returns {() => void} A cleanup function to remove the added event listeners.
   *
   * @example
   * ```tsx
   * const { addGlobalListeners } = useCaptureEvent();
   * addGlobalListeners(['click'], '.trackable', ['id', 'name']);
   * ```
   */
  const addGlobalListeners = useCallback(
    (
      eventTypes: string[],
      dataAttributes: string[],
      selector = "[data-event]"
    ) => {
      const globalListener = (event: Event) => {
        const target = (event.target as HTMLElement).closest(selector);
        if (target) {
          const eventData: Record<string, any> = {};
          dataAttributes.forEach((attr) => {
            const value = target.getAttribute(`data-${attr}`);
            if (value) {
              eventData[attr] = value;
            }
          });

          const eventName = target.getAttribute("data-event") || "";

          handleUserAction(eventName, eventData);
        }
      };

      eventTypes.forEach((eventType) => {
        document.addEventListener(eventType, globalListener);
      });

      return () => {
        eventTypes.forEach((eventType) => {
          document.removeEventListener(eventType, globalListener);
        });
      };
    },
    [handleUserAction]
  );

  return (
    <EventContext.Provider
      value={{ handleUserAction, handleResponseAction, addGlobalListeners }}
    >
      {children}
      <CapturedEventsList />
    </EventContext.Provider>
  );
};

/**
 * Custom hook to access the event context.
 *
 * This hook provides access to the event context, which includes event data and dispatch functions.
 * It must be used within an `EventProvider` to function correctly.
 *
 * @template E - The type of the event name. Defaults to `string`.
 * @template D - The type of the event data. Defaults to `Record<string, any>`.
 *
 * @returns {EventContextType<E, D>} The event context, typed with the provided event name and data types.
 *
 * @throws {Error} If the hook is used outside of an `EventProvider`.
 */
export const useCaptureEvent = <
  E = string,
  D = Record<string, any>
>(): EventContextType<E, D> => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useCaptureEvent must be used within an EventProvider");
  }
  return context as EventContextType<E, D>;
};
