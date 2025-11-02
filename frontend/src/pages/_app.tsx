import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Prevent Next.js error overlay for handled API errors
    const handleError = (event: ErrorEvent) => {
      // Check if it's an API error that we're handling
      if (
        event.message?.includes('Database already has') ||
        event.message?.includes('Failed to') ||
        event.error?.response?.data
      ) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if it's an API error that we're handling
      if (
        event.reason?.message?.includes('Database already has') ||
        event.reason?.message?.includes('Failed to') ||
        event.reason?.response?.data
      ) {
        event.preventDefault();
        return true;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <Component {...pageProps} />;
}
