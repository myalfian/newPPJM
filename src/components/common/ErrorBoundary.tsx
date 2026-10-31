import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to console for telemetry
    console.error('[Production Error Boundary Caught Error]:', error, errorInfo);

    // Auto-recover from stale Vite chunks after new deployments
    const errorMsg = error?.message || '';
    const isChunkLoadError =
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Loading chunk') ||
      error?.name === 'ChunkLoadError';

    if (isChunkLoadError && typeof window !== 'undefined') {
      const hasRetried = sessionStorage.getItem('chunk_retry_ts');
      const now = Date.now();
      // If we haven't retried in the last 15 seconds, reload cleanly to fetch new assets
      if (!hasRetried || now - Number(hasRetried) > 15000) {
        sessionStorage.setItem('chunk_retry_ts', String(now));
        window.location.reload();
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleHardReset = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
          });
        }
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleCopyError = () => {
    const text = `Error: ${this.state.error?.toString()}\n\nStack: ${this.state.errorInfo?.componentStack || 'No component stack'}`;
    navigator.clipboard.writeText(text);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorText = this.state.error?.toString() || 'Unknown Error';
      const isChunkError =
        errorText.includes('Failed to fetch dynamically imported module') ||
        errorText.includes('Loading chunk') ||
        this.state.error?.name === 'ChunkLoadError';

      return (
        <div className="min-h-screen min-h-[100dvh] bg-surface flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-stone-200/80 dark:border-zinc-800 p-6 sm:p-8 text-center space-y-6">
            {/* Header Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Error Copy */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                {isChunkError ? 'Pembaruan Sistem Terdeteksi' : 'Terjadi Kendala Memuat Halaman'}
              </h1>
              <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">
                {isChunkError
                  ? 'Versi aplikasi terbaru telah dirilis di server. Silakan muat ulang halaman untuk memperbarui modul.'
                  : 'Mohon maaf atas ketidaknyamanannya. Sistem mengamankan sesi Anda agar tidak terjadi kegagalan data. Silakan muat ulang halaman atau kembali ke beranda.'}
              </p>
            </div>

            {/* Collapsible Error Diagnostics (Always Accessible) */}
            {this.state.error && (
              <details className="text-left bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-3.5 text-xs text-stone-700 dark:text-zinc-300">
                <summary className="font-bold text-stone-800 dark:text-zinc-200 cursor-pointer flex items-center justify-between select-none">
                  <span>Detail Diagnostik Kendala</span>
                  <span className="text-[10px] text-stone-400">Klik untuk buka/tutup</span>
                </summary>
                <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-zinc-700 space-y-2">
                  <p className="font-mono text-[11px] text-rose-700 dark:text-rose-400 break-words font-semibold">
                    {errorText}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-[10px] text-stone-500 dark:text-zinc-400 whitespace-pre-wrap font-mono max-h-36 overflow-y-auto bg-stone-100 dark:bg-zinc-900 p-2 rounded-xl">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                  <button
                    type="button"
                    onClick={this.handleCopyError}
                    className="mt-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {this.state.copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{this.state.copied ? 'Detail Berhasil Disalin!' : 'Salin Laporan Kendala'}</span>
                  </button>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleHardReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium text-sm transition-colors border border-amber-300/60 dark:border-amber-700/60 active:scale-[0.98] cursor-pointer"
                title="Hapus cache modul lokal & muat ulang"
              >
                <Trash2 className="w-4 h-4" />
                Bersihkan Cache
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 font-medium text-sm transition-colors active:scale-[0.98] cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Beranda
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
