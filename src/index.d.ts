import { ReactNode, FC } from "react";

/**
 * Represents the context type for handling events in the application.
 *
 * @template E - The type of the event name, defaults to `string`.
 * @template D - The type of the event data, defaults to `Record<string, any>`.
 */
export interface EventContextType<E = string, D = Record<string, any>> {
  /**
   * Handles a user action event.
   *
   * @param eventName - The name of the event.
   * @param eventData - The data associated with the event.
   */
  handleUserAction: (eventName: E, eventData: D) => void;

  /**
   * Handles a response action event.
   *
   * @param eventName - The name of the event.
   * @param eventData - The data associated with the event.
   * @param error - Optional flag indicating if there was an error.
   */
  handleResponseAction: (eventName: E, eventData: D, error?: boolean) => void;

  /**
   * Adds global event listeners.
   *
   * @param eventTypes - An array of event types to listen for.
   * @param selector - The CSS selector to target elements.
   * @param dataAttributes - An array of data attributes to include.
   * @returns A function to remove the added event listeners.
   */
  addGlobalListeners: (
    eventTypes: string[],
    selector: string,
    dataAttributes: string[]
  ) => () => void;
}

export interface EventProviderProps {
  children: ReactNode;
}

/**
 * A React functional component that provides event handling capabilities.
 *
 * @component
 * @param {EventProviderProps} props - The properties for the EventProvider component.
 */
export const EventProvider: FC<EventProviderProps>;

/**
 * Custom hook to use an event context.
 *
 * @template E - The type of the event name. Defaults to `string`.
 * @template D - The type of the event data. Defaults to `Record<string, any>`.
 * @returns {EventContextType<E, D>} The event context type with the specified event name and data.
 */
export function useEvent<
  E = string,
  D = Record<string, any>
>(): EventContextType<E, D>;

declare const registerServiceWorker: () => void;
