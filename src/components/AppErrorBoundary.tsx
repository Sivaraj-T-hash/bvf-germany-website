import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/** Keeps a rendering error on one page from blanking the whole site. */
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page error caught by AppErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong on this page</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">Please reload the page. If it keeps happening, go back to the home page.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-[#132033] px-5 py-2.5 text-sm font-semibold text-white">
              Reload page
            </button>
            <a href="/" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground">
              Go to home page
            </a>
          </div>
        </div>
      </div>
    );
  }
}
