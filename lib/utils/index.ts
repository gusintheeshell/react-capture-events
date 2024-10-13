export type RegisterServiceWorkerOptions = {
  scope?: string
}

/**
 * Registers a service worker with the given options.
 *
 * @param options - Optional configuration for the service worker registration.
 * @returns A promise that resolves when the service worker is registered.
 *
 * @remarks
 * This function checks if the `serviceWorker` is available in the navigator.
 * If available, it attempts to register the service worker located at `/sw.js`
 * with the specified scope from the options or defaults to `'/'`.
 *
 * The function logs the status of the service worker (installing, installed, active)
 * and optionally sends a message to the waiting service worker to skip waiting.
 *
 * @example
 * ```typescript
 * registerServiceWorker({ scope: '/app/' })
 *   .then(() => console.log('Service worker registered successfully'))
 *   .catch((error) => console.error('Service worker registration failed', error));
 * ```
 *
 * @throws Will log an error message if the service worker registration fails.
 */
export const registerServiceWorker = async (
  options?: RegisterServiceWorkerOptions,
): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: options?.scope || '/',
      })

      const logServiceWorkerStatus = (status: string) => {
        console.info(`Service worker: ${status}`)
      }

      if (registration.installing) {
        logServiceWorkerStatus('installing')
      } else if (registration.waiting) {
        logServiceWorkerStatus('installed')
      } else if (registration.active) {
        logServiceWorkerStatus('active')
      }

      // Optional: Check for updates
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    } catch (error) {
      console.error(`Service worker registration failed with error: ${error}`)
    }
  }
}
