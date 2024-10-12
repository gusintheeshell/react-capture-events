export type RegisterServiceWorkerOptions = {
  scope?: string;
};

export const registerServiceWorker = async (
  options?: RegisterServiceWorkerOptions
): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: options?.scope || "/",
      });

      const logServiceWorkerStatus = (status: string) => {
        console.info(`Service worker: ${status}`);
      };

      if (registration.installing) {
        logServiceWorkerStatus("installing");
      } else if (registration.waiting) {
        logServiceWorkerStatus("installed");
      } else if (registration.active) {
        logServiceWorkerStatus("active");
      }

      // Optional: Check for updates
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    } catch (error) {
      console.error(`Service worker registration failed with error: ${error}`);
    }
  }
};
