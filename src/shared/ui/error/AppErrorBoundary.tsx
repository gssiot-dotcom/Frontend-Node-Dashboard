import { PropsWithChildren } from "react"
import { ErrorBoundary } from "react-error-boundary"
// import { reportError } from "@/shared/lib/report-error";

function AppCrashFallback() {
  return (
    <div className="p-6">
      <h1>Something went wrong</h1>
      <p>Please refresh the page.</p>
    </div>
  );
}

export function AppErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={AppCrashFallback}
      onError={(error, info) => {
        console.error("App crash", error, info);
        // reportError(error, { componentStack: info.componentStack });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}