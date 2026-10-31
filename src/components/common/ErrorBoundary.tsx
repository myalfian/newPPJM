import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In production, integrate with remote telemetry (e.g. Sentry) if configured
    if (true) {
      console.error('[Production Error Boundary Caught Error]:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen min-h-[100dvh] bg-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-stone-200/80 p-8 text-center space-y-6">
            {/* Header Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Error Copy */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                Terjadi Kendala Memuat Halaman
              </h1>
              <p className="text-sm text-stone-600 leading-relaxed">
                Mohon maaf atas ketidaknyamanannya. Sistem mengamankan sesi Anda agar tidak terjadi kegagalan data. Silakan muat ulang halaman atau kembali ke beranda.
              </p>
            </div>

            {/* Dev Stack Trace Details (Hidden in Production) */}
            {isDev && this.state.error && (
              <details className="text-left bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-700 overflow-x-auto">
                <summary className="font-semibold text-rose-700 cursor-pointer">
                  Detail Teknis (Dev Mode Sahaja)
                </summary>
                <p className="mt-2 font-mono text-[11px] text-rose-900 break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-[10px] text-stone-600 whitespace-pre-wrap font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors shadow-sm active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm transition-colors active:scale-[0.98]"
              >
                <Home className="w-4 h-4" />
                Ke Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
